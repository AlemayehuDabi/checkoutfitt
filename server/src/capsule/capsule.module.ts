import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { ClosetModule } from '../closet/closet.module';
import { CapsuleController } from './capsule.controller';
import { CapsuleService } from './capsule.service';

@Module({
  imports: [LlmModule, ClosetModule],
  controllers: [CapsuleController],
  providers: [CapsuleService],
})
export class CapsuleModule {}
