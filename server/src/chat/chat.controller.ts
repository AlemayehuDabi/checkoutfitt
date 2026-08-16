import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiRateLimit } from '../common/throttling';
import { ChatService } from './chat.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  listMessages(
    @CurrentUser() user: CurrentUser,
    @Query() query: ListChatMessagesQueryDto,
  ) {
    return this.chatService.listMessages(user.id, query);
  }

  /**
   * Returns JSON by default. A client that sends `Accept: text/event-stream`
   * gets the assistant's reply streamed as SSE `delta` events, ending with a
   * `done` event carrying the same payload the JSON path returns (both
   * messages persisted, outfit card included). Tool-call resolution always
   * happens as a normal (non-streaming) call first — only the final
   * natural-language answer is streamed, since decision-time tool routing
   * and token streaming don't compose cleanly across providers.
   */
  @AiRateLimit()
  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @CurrentUser() user: CurrentUser,
    @Body() dto: SendChatMessageDto,
    @Headers('accept') accept: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!accept?.includes('text/event-stream')) {
      return this.chatService.sendMessage(user.id, dto);
    }

    res.writeHead(HttpStatus.OK, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const onDelta = (chunk: string) => {
      res.write(`event: delta\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
    };

    try {
      const result = await this.chatService.sendMessage(user.id, dto, onDelta);
      res.write(`event: done\ndata: ${JSON.stringify(result)}\n\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
    } finally {
      res.end();
    }
    return undefined;
  }
}
