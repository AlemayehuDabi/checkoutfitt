import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
  buildOutfitPrompt,
  GenerateOutfitParams,
  GeneratedOutfit,
  LLMProvider,
  OUTFIT_JSON_SCHEMA,
} from '../llm-provider.interface';
import {
  ChatParams,
  ChatResult,
  StreamChatParams,
} from '../chat-provider.interface';

@Injectable()
export class AnthropicLlmProvider implements LLMProvider {
  private readonly logger = new Logger(AnthropicLlmProvider.name);
  private readonly model: string;
  private _client?: Anthropic;

  constructor(private readonly config: ConfigService) {
    this.model = config.get<string>('ai.anthropicLlmModel') ?? 'claude-opus-5';
  }

  // Constructing the SDK client eagerly in the constructor would throw for
  // every registered provider at boot, not just the one LLM_PROVIDER
  // actually selects — Nest instantiates all three concrete providers
  // because LLMService takes each as a constructor dependency. Deferring
  // construction to first use means an unselected provider's missing/empty
  // API key never crashes the app.
  private get client(): Anthropic {
    if (!this._client) {
      this._client = new Anthropic({
        apiKey: this.config.get<string>('ai.anthropicApiKey'),
      });
    }
    return this._client;
  }

  async generateOutfit(params: GenerateOutfitParams): Promise<GeneratedOutfit> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      output_config: {
        format: { type: 'json_schema', schema: OUTFIT_JSON_SCHEMA },
      },
      messages: [{ role: 'user', content: buildOutfitPrompt(params) }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      this.logger.error(
        'No text block in Anthropic outfit-generation response',
      );
      throw new Error('Anthropic outfit-generation response contained no text');
    }
    return JSON.parse(textBlock.text) as GeneratedOutfit;
  }

  async chat(params: ChatParams): Promise<ChatResult> {
    const messages: Anthropic.MessageParam[] = [
      ...params.history.map((h) => ({ role: h.role, content: h.content })),
      {
        role: 'user' as const,
        content: params.imageUrl
          ? [
              {
                type: 'image' as const,
                source: { type: 'url' as const, url: params.imageUrl },
              },
              { type: 'text' as const, text: params.userMessage },
            ]
          : params.userMessage,
      },
    ];

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: params.systemPrompt,
      tools: params.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema as Anthropic.Tool.InputSchema,
      })),
      messages,
    });

    const toolUseBlock = response.content.find(
      (block) => block.type === 'tool_use',
    );
    if (toolUseBlock && toolUseBlock.type === 'tool_use') {
      return {
        text: null,
        toolCall: {
          name: toolUseBlock.name,
          input: toolUseBlock.input as Record<string, unknown>,
        },
      };
    }

    const textBlock = response.content.find((block) => block.type === 'text');
    return {
      text: textBlock && textBlock.type === 'text' ? textBlock.text : '',
      toolCall: null,
    };
  }

  async streamChat(params: StreamChatParams): Promise<string> {
    const messages: Anthropic.MessageParam[] = [
      ...params.history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user' as const, content: params.userMessage },
    ];

    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: 1024,
      system: params.systemPrompt,
      messages,
    });
    stream.on('text', (delta) => params.onDelta(delta));

    const finalMessage = await stream.finalMessage();
    const textBlock = finalMessage.content.find(
      (block) => block.type === 'text',
    );
    return textBlock && textBlock.type === 'text' ? textBlock.text : '';
  }
}
