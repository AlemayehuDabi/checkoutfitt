import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Content } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
import {
  buildOutfitPrompt,
  GenerateOutfitParams,
  GeneratedOutfit,
  LLMProvider,
  OUTFIT_JSON_SCHEMA,
} from '../llm-provider.interface';
import {
  ChatHistoryMessage,
  ChatParams,
  ChatResult,
  StreamChatParams,
} from '../chat-provider.interface';
import { StructuredParams } from '../structured-output.interface';
import { fetchImageAsBase64 } from '../../image-fetch.util';

// Gemini uses "model" rather than "assistant" for the AI's turns.
function toGeminiHistory(history: ChatHistoryMessage[]): Content[] {
  return history.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
}

@Injectable()
export class GeminiLlmProvider implements LLMProvider {
  private readonly logger = new Logger(GeminiLlmProvider.name);
  private readonly model: string;
  private _client?: GoogleGenAI;

  constructor(private readonly config: ConfigService) {
    this.model = config.get<string>('ai.geminiLlmModel') ?? 'gemini-2.5-flash';
  }

  // See AnthropicLlmProvider for why this is lazy: Nest instantiates all
  // three concrete providers regardless of which one LLM_PROVIDER selects.
  private get client(): GoogleGenAI {
    if (!this._client) {
      this._client = new GoogleGenAI({
        apiKey: this.config.get<string>('ai.geminiApiKey'),
      });
    }
    return this._client;
  }

  async generateOutfit(params: GenerateOutfitParams): Promise<GeneratedOutfit> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: buildOutfitPrompt(params),
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: OUTFIT_JSON_SCHEMA,
      },
    });

    if (!response.text) {
      this.logger.error('Empty Gemini outfit-generation response');
      throw new Error('Gemini outfit-generation response contained no text');
    }
    return JSON.parse(response.text) as GeneratedOutfit;
  }

  async generateStructured<T>(params: StructuredParams): Promise<T> {
    const parts: {
      text?: string;
      inlineData?: { data: string; mimeType: string };
    }[] = [{ text: params.prompt }];
    // Gemini has no arbitrary-URL image part, so images are fetched and
    // inlined — same reason GeminiVisionProvider does it.
    for (const url of params.imageUrls ?? []) {
      const { data, mimeType } = await fetchImageAsBase64(url);
      parts.push({ inlineData: { data, mimeType } });
    }

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [{ role: 'user', parts }],
      config: {
        ...(params.systemPrompt
          ? { systemInstruction: params.systemPrompt }
          : {}),
        responseMimeType: 'application/json',
        responseJsonSchema: params.schema,
      },
    });

    if (!response.text) {
      this.logger.error(
        `Empty Gemini structured response for "${params.schemaName}"`,
      );
      throw new Error('Gemini structured response contained no text');
    }
    return JSON.parse(response.text) as T;
  }

  async chat(params: ChatParams): Promise<ChatResult> {
    const userParts: {
      text?: string;
      inlineData?: { data: string; mimeType: string };
    }[] = [{ text: params.userMessage }];
    if (params.imageUrl) {
      const { data, mimeType } = await fetchImageAsBase64(params.imageUrl);
      userParts.push({ inlineData: { data, mimeType } });
    }

    const contents: Content[] = [
      ...toGeminiHistory(params.history),
      { role: 'user', parts: userParts },
    ];

    const response = await this.client.models.generateContent({
      model: this.model,
      contents,
      config: {
        systemInstruction: params.systemPrompt,
        tools: [
          {
            functionDeclarations: params.tools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              parametersJsonSchema: tool.inputSchema,
            })),
          },
        ],
      },
    });

    const [functionCall] = response.functionCalls ?? [];
    if (functionCall) {
      return {
        text: null,
        toolCall: {
          name: functionCall.name ?? '',
          input: functionCall.args ?? {},
        },
      };
    }

    return { text: response.text ?? '', toolCall: null };
  }

  async streamChat(params: StreamChatParams): Promise<string> {
    const contents: Content[] = [
      ...toGeminiHistory(params.history),
      { role: 'user', parts: [{ text: params.userMessage }] },
    ];

    const stream = await this.client.models.generateContentStream({
      model: this.model,
      contents,
      config: { systemInstruction: params.systemPrompt },
    });

    let fullText = '';
    for await (const chunk of stream) {
      const delta = chunk.text;
      if (delta) {
        params.onDelta(delta);
        fullText += delta;
      }
    }
    return fullText;
  }
}
