import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { VisionModule } from '../ai/vision/vision.module';
import { ClosetModule } from '../closet/closet.module';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';

@Module({
  imports: [LlmModule, VisionModule, ClosetModule],
  controllers: [ShoppingController],
  providers: [ShoppingService],
})
export class ShoppingModule {}
