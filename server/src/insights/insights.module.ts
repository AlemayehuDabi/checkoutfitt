import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { ClosetModule } from '../closet/closet.module';
import { InsightsController } from './insights.controller';
import { GapAnalysisService } from './gap-analysis.service';
import { ClosetValueService } from './closet-value.service';

@Module({
  imports: [LlmModule, ClosetModule],
  controllers: [InsightsController],
  providers: [GapAnalysisService, ClosetValueService],
})
export class InsightsModule {}
