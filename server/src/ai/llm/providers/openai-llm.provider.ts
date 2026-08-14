import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
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
export class OpenAiLlmProvider implements LLMProvider {
  private readonly logger = new Logger(OpenAiLlmProvider.name);
  private readonly model: string;
  private _client?: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.model = config.get<string>('ai.openaiLlmModel') ?? 'gpt-4o-mini';
  }

  // See AnthropicLlmProvider for why this is lazy: Nest instantiates all
  // three concrete providers regardless of which one LLM_PROVIDER selects,
  // and the OpenAI SDK throws in its constructor when no API key is set.
  private get client(): OpenAI {
    if (!this._client) {
      this._client = new OpenAI({
        apiKey: this.config.get<string>('ai.openaiApiKey'),
      });
    }
    return this._client;
  }

  async generateOutfit(params: GenerateOutfitParams): Promise<GeneratedOutfit> {
    const response = await this.client.responses.create({
      model: this.model,
      input: [{ role: 'user', content: buildOutfitPrompt(params) }],
      text: {
        format: {
          type: 'json_schema',
          name: 'outfit',
          schema: OUTFIT_JSON_SCHEMA,
          strict: true,
        },
      },
    });

    if (!response.output_text) {
      this.logger.error('Empty OpenAI outfit-generation response');
      throw new Error(
        'OpenAI outfit-generation response contained no output text',
      );
    }
    return JSON.parse(response.output_text) as GeneratedOutfit;
  }

  async chat(params: ChatParams): Promise<ChatResult> {
    const input: OpenAI.Responses.ResponseInputItem[] = [
      ...params.history.map((h) => ({ role: h.role, content: h.content })),
      {
        role: 'user' as const,
        content: params.imageUrl
          ? [
              { type: 'input_text' as const, text: params.userMessage },
              {
                type: 'input_image' as const,
                image_url: params.imageUrl,
                detail: 'auto' as const,
              },
            ]
          : params.userMessage,
      },
    ];

    const response = await this.client.responses.create({
      model: this.model,
      instructions: params.systemPrompt,
      input,
      tools: params.tools.map((tool) => ({
        type: 'function' as const,
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
        strict: false,
      })),
    });

    const functionCall = response.output.find(
      (item) => item.type === 'function_call',
    );
    if (functionCall && functionCall.type === 'function_call') {
      return {
        text: null,
        toolCall: {
          name: functionCall.name,
          input: JSON.parse(functionCall.arguments) as Record<string, unknown>,
        },
      };
    }

    return { text: response.output_text ?? '', toolCall: null };
  }

  async streamChat(params: StreamChatParams): Promise<string> {
    const input: OpenAI.Responses.ResponseInputItem[] = [
      ...params.history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user' as const, content: params.userMessage },
    ];

    const stream = await this.client.responses.create({
      model: this.model,
      instructions: params.systemPrompt,
      input,
      stream: true,
    });

    let fullText = '';
    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') {
        params.onDelta(event.delta);
        fullText += event.delta;
      }
    }
    return fullText;
  }
}
