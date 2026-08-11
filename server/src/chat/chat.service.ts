import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLMService } from '../ai/llm/llm.service';
import {
  ChatHistoryMessage,
  ChatToolCall,
} from '../ai/llm/chat-provider.interface';
import { ClosetService } from '../closet/closet.service';
import { OutfitService } from '../outfit/outfit.service';
import {
  OUTFIT_CONTEXTS,
  DEFAULT_DAILY_OUTFIT_CONTEXT,
} from '../outfit/constants';
import type { ClosetItemTypeValue } from '../closet/constants';
import type { OutfitContextValue } from '../outfit/constants';
import { CHAT_HISTORY_LIMIT, CHAT_SYSTEM_PROMPT } from './constants';
import { CHAT_TOOLS } from './tools';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';

interface ToolExecutionResult {
  resultText: string;
  outfitCardId?: string;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LLMService,
    private readonly closetService: ClosetService,
    private readonly outfitService: OutfitService,
  ) {}

  async listMessages(userId: string, query: ListChatMessagesQueryDto) {
    const messages = await this.prisma.chatMessage.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      take: query.limit ?? 30,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      include: { outfitCard: { include: { items: true } } },
    });
    return messages.reverse(); // chronological order for display
  }

  private async getHistory(userId: string): Promise<ChatHistoryMessage[]> {
    const recent = await this.prisma.chatMessage.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      take: CHAT_HISTORY_LIMIT,
    });
    return recent.reverse().map((message) => ({
      role:
        message.role === 'ASSISTANT'
          ? ('assistant' as const)
          : ('user' as const),
      content: message.content,
    }));
  }

  private async executeTool(
    userId: string,
    toolCall: ChatToolCall,
  ): Promise<ToolExecutionResult> {
    if (toolCall.name === 'list_closet_items') {
      const type = toolCall.input.type as ClosetItemTypeValue | undefined;
      const items = await this.closetService.list(userId, {
        type,
        archived: false,
      });
      if (items.length === 0) {
        return {
          resultText:
            "The user's closet has no items matching that filter (or none at all yet).",
        };
      }
      const summary = items
        .map(
          (item) =>
            `${item.category ?? item.type ?? 'item'} (${item.color ?? 'unknown color'})`,
        )
        .join(', ');
      return { resultText: `The user's closet contains: ${summary}.` };
    }

    if (toolCall.name === 'generate_outfit') {
      const requested = toolCall.input.context as string;
      const context = (OUTFIT_CONTEXTS as readonly string[]).includes(requested)
        ? (requested as OutfitContextValue)
        : DEFAULT_DAILY_OUTFIT_CONTEXT;
      const outfit = await this.outfitService.generate(userId, { context });
      const itemSummary = outfit.items
        .map((item) => `${item.category ?? item.type} (${item.color})`)
        .join(', ');
      return {
        resultText: `Generated an outfit for "${context}": ${itemSummary}. Reasoning: ${outfit.explanation}`,
        outfitCardId: outfit.id,
      };
    }

    return { resultText: `Unknown tool "${toolCall.name}".` };
  }

  async sendMessage(
    userId: string,
    dto: SendChatMessageDto,
    onDelta?: (chunk: string) => void,
  ) {
    let attachedImageUrl: string | undefined;
    if (dto.attachmentId) {
      const attachment = await this.prisma.attachment.findUnique({
        where: { id: dto.attachmentId },
      });
      if (!attachment || attachment.ownerId !== userId) {
        throw new NotFoundException('Attachment not found');
      }
      attachedImageUrl = attachment.secureUrl;
    }

    const history = await this.getHistory(userId);

    const first = await this.llmService.chat({
      systemPrompt: CHAT_SYSTEM_PROMPT,
      history,
      userMessage: dto.message,
      imageUrl: attachedImageUrl,
      tools: CHAT_TOOLS,
    });

    let finalText: string;
    let outfitCardId: string | undefined;

    if (first.toolCall) {
      const { resultText, outfitCardId: cardId } = await this.executeTool(
        userId,
        first.toolCall,
      );
      outfitCardId = cardId;

      // Tool results are folded back in as plain text context rather than
      // replayed as native tool_use/tool_result blocks — the three
      // providers' tool-result message shapes differ enough that this
      // keeps the follow-up call provider-agnostic at the cost of a
      // slightly less "native" transcript.
      const followUpMessage = `${dto.message}\n\n[Tool result from "${first.toolCall.name}": ${resultText} Now reply to the user's message naturally using this information — don't mention tools or system notes.]`;

      if (onDelta) {
        finalText = await this.llmService.streamChat({
          systemPrompt: CHAT_SYSTEM_PROMPT,
          history,
          userMessage: followUpMessage,
          onDelta,
        });
      } else {
        const followUp = await this.llmService.chat({
          systemPrompt: CHAT_SYSTEM_PROMPT,
          history,
          userMessage: followUpMessage,
          tools: [],
        });
        finalText = followUp.text ?? resultText;
      }
    } else {
      finalText = first.text ?? '';
      onDelta?.(finalText);
    }

    const [userMessage, assistantMessage] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          ownerId: userId,
          role: 'USER',
          content: dto.message,
          attachedImageUrl,
        },
      }),
      this.prisma.chatMessage.create({
        data: {
          ownerId: userId,
          role: 'ASSISTANT',
          content: finalText,
          outfitCardId,
        },
      }),
    ]);

    const outfitCard = outfitCardId
      ? await this.outfitService.findOne(userId, outfitCardId)
      : null;

    return { userMessage, assistantMessage, outfitCard };
  }
}
