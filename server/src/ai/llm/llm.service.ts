import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
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

/**
 * Digs an HTTP status out of a vendor SDK error. The three SDKs don't agree
 * on where it lives — some expose a numeric `status`, and Gemini reports it
 * only inside the JSON body of the error message.
 */
function extractStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      status?: unknown;
      code?: unknown;
      response?: { status?: unknown };
    };
    for (const value of [
      candidate.status,
      candidate.code,
      candidate.response?.status,
    ]) {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        return Number(value);
      }
    }
  }
  if (error instanceof Error && /"code"\s*:\s*(\d{3})/.test(error.message)) {
    return Number(/"code"\s*:\s*(\d{3})/.exec(error.message)?.[1]);
  }
  return undefined;
}

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
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Structured generation "${params.schemaName}" failed: ${message}`,
      );

      if (extractStatus(error) === HttpStatus.TOO_MANY_REQUESTS) {
        throw new HttpException(
          'The AI provider is rate limited right now. Please try again shortly.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new ServiceUnavailableException(
        'The AI provider is currently unavailable. Please try again shortly.',
      );
    }
  }
}
