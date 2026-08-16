import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider } from '../constants';
import {
  GenerateOutfitParams,
  GeneratedOutfit,
  LLMProvider,
} from './llm-provider.interface';
import {
  ChatParams,
  ChatResult,
  StreamChatParams,
} from './chat-provider.interface';
import { StructuredParams } from './structured-output.interface';
import { AnthropicLlmProvider } from './providers/anthropic-llm.provider';
import { OpenAiLlmProvider } from './providers/openai-llm.provider';
import { GeminiLlmProvider } from './providers/gemini-llm.provider';
import { toProviderHttpException } from '../provider-error.util';

/**
 * Thin facade other modules depend on instead of a concrete AI vendor SDK.
 * Which provider actually runs is chosen once, from LLM_PROVIDER, so
 * swapping vendors is a config change rather than a code change.
 */
@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
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

  chat(params: ChatParams): Promise<ChatResult> {
    return this.provider.chat(params);
  }

  streamChat(params: StreamChatParams): Promise<string> {
    return this.provider.streamChat(params);
  }

  /**
   * Schema-driven JSON, optionally over images. See StructuredParams.
   *
   * Vendor SDK failures are surfaced as HTTP errors rather than escaping as
   * an unhandled 500 — an upstream problem isn't an internal error, and the
   * same convention already applies to the weather provider.
   *
   * Quota/rate-limit responses stay 429 rather than collapsing into 503:
   * they're the caller's throttling to wait out, not a broken provider, and
   * a client should back off rather than treat it as an outage. The original
   * error is always logged so real bugs behind either status stay
   * diagnosable.
   */
  async generateStructured<T>(params: StructuredParams): Promise<T> {
    try {
      return await this.provider.generateStructured<T>(params);
    } catch (error) {
      throw toProviderHttpException(
        error,
        `Structured generation "${params.schemaName}"`,
        this.logger,
      );
    }
  }
}
