import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { VisionService } from '../ai/vision/vision.service';
import { ClosetItemType } from '../../prisma/generated/prisma';
import { ClosetService } from './closet.service';
import { CLOSET_DETECTION_QUEUE } from './constants';

interface DetectionJobData {
  closetItemId: string;
}

@Processor(CLOSET_DETECTION_QUEUE)
export class ClosetDetectionProcessor extends WorkerHost {
  private readonly logger = new Logger(ClosetDetectionProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly visionService: VisionService,
    private readonly closetService: ClosetService,
  ) {
    super();
  }

  async process(job: Job<DetectionJobData>): Promise<void> {
    const { closetItemId } = job.data;
    const item = await this.prisma.closetItem.findUnique({
      where: { id: closetItemId },
    });
    if (!item) {
      this.logger.warn(
        `Closet item ${closetItemId} no longer exists — skipping detection`,
      );
      return;
    }

    await this.prisma.closetItem.update({
      where: { id: closetItemId },
      data: { status: 'PROCESSING' },
    });

    try {
      const detected = await this.visionService.detectGarment(item.imageUrl);
      await this.prisma.closetItem.update({
        where: { id: closetItemId },
        data: {
          type: detected.type.toUpperCase() as ClosetItemType,
          category: detected.category,
          color: detected.color,
          tags: detected.tags,
          status: 'DONE',
          failureReason: null,
        },
      });
      // The item only becomes analyzable now that it has type/category/color,
      // so this is the point at which derived analyses go stale.
      await this.closetService.invalidateDerivedAnalyses(item.ownerId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Detection failed for closet item ${closetItemId}: ${message}`,
      );
      await this.prisma.closetItem.update({
        where: { id: closetItemId },
        data: { status: 'FAILED', failureReason: message },
      });
    }
  }
}
