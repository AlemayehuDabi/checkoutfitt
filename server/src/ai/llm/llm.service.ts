import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider } from '../constants';
import {
  GenerateOutfitParams,
  GeneratedOutfit,
  LLMProvider,
} from './llm-provider.interface';
import { AnthropicLlmProvider } from './providers/anthropic-llm.provider';
import { OpenAiLlmProvider } from './providers/openai-llm.provider';
import { GeminiLlmProvider } from './providers/gemini-llm.provider';

/**
 * Thin facade other modules depend on instead of a concrete AI vendor SDK.
 * Which provider actually runs is chosen once, from LLM_PROVIDER, so
 * swapping vendors is a config change rather than a code change.
 */
@Injectable()
export class LLMService {
  private readonly provider: LLMProvider;

  constructor(
    config: ConfigService,
    anthropic: AnthropicLlmProvider,
    openai: OpenAiLlmProvider,
    gemini: GeminiLlmProvider,
  ) {
    const selected = (config.get<string>('ai.llmProvider') ??
      'anthropic') as AiProvider;
    const providers: Record<AiProvider, LLMProvider> = {
      anthropic,
      openai,
      gemini,
    };
    this.provider = providers[selected];
  }

  generateOutfit(params: GenerateOutfitParams): Promise<GeneratedOutfit> {
    return this.provider.generateOutfit(params);
  }
}
