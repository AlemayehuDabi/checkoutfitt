import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { OutfitRatingController } from './outfit-rating.controller';
import { OutfitRatingService } from './outfit-rating.service';

@Module({
  imports: [LlmModule],
  controllers: [OutfitRatingController],
  providers: [OutfitRatingService],
})
export class OutfitRatingModule {}
