import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import {
  buildOutfitPrompt,
  GenerateOutfitParams,
  GeneratedOutfit,
  LLMProvider,
  OUTFIT_JSON_SCHEMA,
} from '../llm-provider.interface';

@Injectable()
export class GeminiLlmProvider implements LLMProvider {
  private readonly logger = new Logger(GeminiLlmProvider.name);
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(config: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: config.get<string>('ai.geminiApiKey'),
    });
    this.model = config.get<string>('ai.geminiLlmModel') ?? 'gemini-pro-latest';
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
}
