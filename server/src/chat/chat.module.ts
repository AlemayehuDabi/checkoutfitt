import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { ClosetModule } from '../closet/closet.module';
import { OutfitModule } from '../outfit/outfit.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [LlmModule, ClosetModule, OutfitModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
