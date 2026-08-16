import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import {
  closetDerivedCacheKeys,
  closetDerivedCachePatterns,
} from '../cache/cache-keys';
import { CLOSET_DETECTION_QUEUE, toClosetItemType } from './constants';
import { IngestClosetItemDto } from './dto/ingest-closet-item.dto';
import { BulkIngestClosetItemsDto } from './dto/bulk-ingest-closet-items.dto';
import { UpdateClosetItemDto } from './dto/update-closet-item.dto';
import { ListClosetItemsQueryDto } from './dto/list-closet-items-query.dto';

@Injectable()
export class ClosetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
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

  async ingest(userId: string, dto: IngestClosetItemDto) {
    const attachment = await this.resolveOwnedAttachment(
      userId,
      dto.attachmentId,
    );
    const item = await this.prisma.closetItem.create({
      data: {
        ownerId: userId,
        imageUrl: attachment.secureUrl,
        attachmentId: attachment.id,
      },
    });
    await this.detectionQueue.add('detect', { closetItemId: item.id });
    await this.invalidateDerivedAnalyses(userId);
    return item;
  }

  async bulkIngest(userId: string, dto: BulkIngestClosetItemsDto) {
    const items: Awaited<ReturnType<ClosetService['ingest']>>[] = [];
    for (const attachmentId of dto.attachmentIds) {
      items.push(await this.ingest(userId, { attachmentId }));
    }
    return items;
  }

  list(userId: string, query: ListClosetItemsQueryDto) {
    return this.prisma.closetItem.findMany({
      where: {
        ownerId: userId,
        archived: query.archived ?? false,
        ...(query.type && { type: toClosetItemType(query.type) }),
        ...(query.category && {
          category: { contains: query.category, mode: 'insensitive' },
        }),
        ...(query.color && {
          color: { contains: query.color, mode: 'insensitive' },
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
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
    await this.findOne(userId, id);
    await this.prisma.closetItem.delete({ where: { id } });
    await this.invalidateDerivedAnalyses(userId);
  }
}
