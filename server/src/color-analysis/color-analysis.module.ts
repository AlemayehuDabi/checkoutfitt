import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { ColorAnalysisController } from './color-analysis.controller';
import { ColorAnalysisService } from './color-analysis.service';

@Module({
  imports: [LlmModule],
  controllers: [ColorAnalysisController],
  providers: [ColorAnalysisService],
})
export class ColorAnalysisModule {}
