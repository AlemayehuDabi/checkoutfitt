import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { ClosetModule } from '../closet/closet.module';
import { StyleCoachController } from './style-coach.controller';
import { StyleCoachService } from './style-coach.service';

@Module({
  imports: [LlmModule, ClosetModule],
  controllers: [StyleCoachController],
  providers: [StyleCoachService],
})
export class StyleCoachModule {}
