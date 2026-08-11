import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CLOSET_DETECTION_QUEUE, toClosetItemType } from './constants';
import { IngestClosetItemDto } from './dto/ingest-closet-item.dto';
import { BulkIngestClosetItemsDto } from './dto/bulk-ingest-closet-items.dto';
import { UpdateClosetItemDto } from './dto/update-closet-item.dto';
import { ListClosetItemsQueryDto } from './dto/list-closet-items-query.dto';

@Injectable()
export class ClosetService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(CLOSET_DETECTION_QUEUE) private readonly detectionQueue: Queue,
  ) {}

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
    return this.prisma.closetItem.update({
      where: { id },
      data: {
        ...(dto.type !== undefined && { type: toClosetItemType(dto.type) }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.archived !== undefined && { archived: dto.archived }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.closetItem.delete({ where: { id } });
  }
}
