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

@Injectable()
export class OpenAiLlmProvider implements LLMProvider {
  private readonly logger = new Logger(OpenAiLlmProvider.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(config: ConfigService) {
    this.client = new OpenAI({ apiKey: config.get<string>('ai.openaiApiKey') });
    this.model = config.get<string>('ai.openaiLlmModel') ?? 'gpt-5.1';
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
}
