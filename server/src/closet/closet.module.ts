import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VisionModule } from '../ai/vision/vision.module';
import { ClosetController } from './closet.controller';
import { ClosetService } from './closet.service';
import { ClosetDetectionProcessor } from './closet.processor';
import { CLOSET_DETECTION_QUEUE } from './constants';

@Module({
  imports: [
    BullModule.registerQueue({ name: CLOSET_DETECTION_QUEUE }),
    VisionModule,
  ],
  controllers: [ClosetController],
  providers: [ClosetService, ClosetDetectionProcessor],
  exports: [ClosetService],
})
export class ClosetModule {}
