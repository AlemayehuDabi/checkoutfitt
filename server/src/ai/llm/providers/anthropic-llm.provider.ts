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

@Injectable()
export class AnthropicLlmProvider implements LLMProvider {
  private readonly logger = new Logger(AnthropicLlmProvider.name);
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(config: ConfigService) {
    this.client = new Anthropic({
      apiKey: config.get<string>('ai.anthropicApiKey'),
    });
    this.model = config.get<string>('ai.anthropicLlmModel') ?? 'claude-opus-5';
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
}
