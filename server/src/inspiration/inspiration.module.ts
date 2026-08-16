import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { ClosetModule } from '../closet/closet.module';
import { InspirationController } from './inspiration.controller';
import { InspirationService } from './inspiration.service';

@Module({
  imports: [LlmModule, ClosetModule],
  controllers: [InspirationController],
  providers: [InspirationService],
})
export class InspirationModule {}
