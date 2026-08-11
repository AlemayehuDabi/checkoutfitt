import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { OutfitController } from './outfit.controller';
import { OutfitService } from './outfit.service';

@Module({
  imports: [LlmModule],
  controllers: [OutfitController],
  providers: [OutfitService],
  exports: [OutfitService],
})
export class OutfitModule {}
