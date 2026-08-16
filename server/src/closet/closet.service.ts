import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { UploadService } from '../upload/upload.service';
import { describeError } from '../common/describe-error.util';
import {
  closetDerivedCacheKeys,
  closetDerivedCachePatterns,
} from '../cache/cache-keys';
import { Prisma } from '../../prisma/generated/prisma';
import {
  CLOSET_DETECTION_QUEUE,
  DEFAULT_CLOSET_PAGE_SIZE,
  DETECTION_JOB_OPTIONS,
  toClosetItemType,
} from './constants';
import { IngestClosetItemDto } from './dto/ingest-closet-item.dto';
import { BulkIngestClosetItemsDto } from './dto/bulk-ingest-closet-items.dto';
import { UpdateClosetItemDto } from './dto/update-closet-item.dto';
import { ListClosetItemsQueryDto } from './dto/list-closet-items-query.dto';

@Injectable()
export class ClosetService {
  private readonly logger = new Logger(ClosetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly uploadService: UploadService,
    @InjectQueue(CLOSET_DETECTION_QUEUE) private readonly detectionQueue: Queue,
  ) {}

  /**
   * Analyses derived from the closet (gap analysis, and later valuation) are
   * cached for a day, so any change to the closet has to drop them or the
   * user sees stale conclusions about a wardrobe they just edited. Called
   * from the detection worker too — that's when an item's type/category/color
   * actually land, which is what those analyses read.
   */
  async invalidateDerivedAnalyses(userId: string): Promise<void> {
    await this.cache.del(...closetDerivedCacheKeys(userId));
    await Promise.all(
      closetDerivedCachePatterns(userId).map((pattern) =>
        this.cache.delByPattern(pattern),
      ),
    );
  }

  private async resolveOwnedAttachment(userId: string, attachmentId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
    });
    if (!attachment || attachment.ownerId !== userId) {
      throw new NotFoundException('Attachment not found');
    }
    return attachment;
  }

  /** Creates the row and queues detection, without touching caches — callers
   * invalidate once so a bulk ingest doesn't do it per item. */
  private async createItem(userId: string, attachmentId: string) {
    const attachment = await this.resolveOwnedAttachment(userId, attachmentId);
    const item = await this.prisma.closetItem.create({
      data: {
        ownerId: userId,
        imageUrl: attachment.secureUrl,
        attachmentId: attachment.id,
      },
    });
    await this.detectionQueue.add(
      'detect',
      { closetItemId: item.id },
      DETECTION_JOB_OPTIONS,
    );
    return item;
  }

  async ingest(userId: string, dto: IngestClosetItemDto) {
    const item = await this.createItem(userId, dto.attachmentId);
    await this.invalidateDerivedAnalyses(userId);
    return item;
  }

  /**
   * Ingests in parallel and reports per-attachment outcomes rather than
   * failing the whole batch: one bad attachment id out of twenty shouldn't
   * discard the nineteen that worked.
   */
  async bulkIngest(userId: string, dto: BulkIngestClosetItemsDto) {
    const outcomes = await Promise.allSettled(
      dto.attachmentIds.map((attachmentId) =>
        this.createItem(userId, attachmentId),
      ),
    );

    const created = outcomes
      .filter((outcome) => outcome.status === 'fulfilled')
      .map((outcome) => outcome.value);
    const failed = outcomes.flatMap((outcome, index) =>
      outcome.status === 'rejected'
        ? [
            {
              attachmentId: dto.attachmentIds[index],
              reason:
                outcome.reason instanceof Error
                  ? outcome.reason.message
                  : 'Unknown error',
            },
          ]
        : [],
    );

    if (created.length > 0) {
      await this.invalidateDerivedAnalyses(userId);
    }
    return {
      created,
      failed,
      createdCount: created.length,
      failedCount: failed.length,
    };
  }

  private buildWhere(
    userId: string,
    query: ListClosetItemsQueryDto,
  ): Prisma.ClosetItemWhereInput {
    return {
      ownerId: userId,
      archived: query.archived ?? false,
      ...(query.type && { type: toClosetItemType(query.type) }),
      ...(query.category && {
        category: { contains: query.category, mode: 'insensitive' },
      }),
      ...(query.color && {
        color: { contains: query.color, mode: 'insensitive' },
      }),
    };
  }

  /**
   * Unpaginated read used internally by the analysis features, which need to
   * reason over the whole wardrobe. The HTTP endpoint uses `listPage`.
   */
  list(userId: string, query: ListClosetItemsQueryDto) {
    return this.prisma.closetItem.findMany({
      where: this.buildWhere(userId, query),
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Paginated read for the API, same offset shape as GET /outfits/saved. */
  async listPage(userId: string, query: ListClosetItemsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_CLOSET_PAGE_SIZE;
    const where = this.buildWhere(userId, query);

    const [items, total] = await Promise.all([
      this.prisma.closetItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.closetItem.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /** Re-queues detection for an item whose detection failed. */
  async retryDetection(userId: string, id: string) {
    const item = await this.findOne(userId, id);
    if (item.status !== 'FAILED') {
      throw new BadRequestException(
        `Only items with a FAILED detection can be retried; this one is ${item.status}.`,
      );
    }

    const reset = await this.prisma.closetItem.update({
      where: { id },
      data: { status: 'PENDING', failureReason: null },
    });
    await this.detectionQueue.add(
      'detect',
      { closetItemId: id },
      DETECTION_JOB_OPTIONS,
    );
    return reset;
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.closetItem.findUnique({ where: { id } });
    if (!item || item.ownerId !== userId) {
      throw new NotFoundException('Closet item not found');
    }
    return item;
  }

  async update(userId: string, id: string, dto: UpdateClosetItemDto) {
    await this.findOne(userId, id);
    const updated = await this.prisma.closetItem.update({
      where: { id },
      data: {
        ...(dto.type !== undefined && { type: toClosetItemType(dto.type) }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.archived !== undefined && { archived: dto.archived }),
      },
    });
    // After the write, so a failed update doesn't drop a still-valid cache.
    await this.invalidateDerivedAnalyses(userId);
    return updated;
  }

  async remove(userId: string, id: string) {
    const item = await this.findOne(userId, id);
    await this.prisma.closetItem.delete({ where: { id } });
    await this.invalidateDerivedAnalyses(userId);

    if (item.attachmentId) {
      await this.cleanUpAttachment(item.attachmentId);
    }
  }

  /**
   * Removes the Cloudinary asset behind a deleted closet item, so deleting an
   * item doesn't leave a paid-for blob orphaned in the account.
   *
   * Only when nothing else points at that Attachment: outfit ratings and
   * colour analyses reference attachments with `onDelete: Cascade`, so
   * deleting a shared row would silently destroy those records too. Failures
   * are logged and swallowed — the closet item is already gone, and a
   * leftover blob is not worth failing the user's request over.
   */
  private async cleanUpAttachment(attachmentId: string): Promise<void> {
    try {
      const attachment = await this.prisma.attachment.findUnique({
        where: { id: attachmentId },
      });
      if (!attachment) {
        return;
      }

      const [closetItems, ratings, colorAnalyses] = await Promise.all([
        this.prisma.closetItem.count({ where: { attachmentId } }),
        this.prisma.outfitRating.count({
          where: { imageAttachmentId: attachmentId },
        }),
        this.prisma.colorAnalysis.count({
          where: { imageAttachmentId: attachmentId },
        }),
      ]);
      if (closetItems + ratings + colorAnalyses > 0) {
        this.logger.debug(
          `Attachment ${attachmentId} is still referenced; leaving it in place`,
        );
        return;
      }

      await this.uploadService.destroy(attachment.publicId);
      await this.prisma.attachment.delete({ where: { id: attachmentId } });
    } catch (error) {
      // Best-effort: the closet item is already gone. The Attachment row is
      // deliberately left in place when the blob deletion fails, so the
      // publicId survives for a later retry rather than the asset being
      // orphaned with nothing pointing at it.
      this.logger.warn(
        `Failed to clean up attachment ${attachmentId} — ${describeError(error)}`,
      );
    }
  }
}
