import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider } from '../constants';
import { DetectedGarment, VisionProvider } from './vision-provider.interface';
import { AnthropicVisionProvider } from './providers/anthropic-vision.provider';
import { OpenAiVisionProvider } from './providers/openai-vision.provider';
import { GeminiVisionProvider } from './providers/gemini-vision.provider';

/**
 * Thin facade other modules depend on instead of a concrete AI vendor SDK.
 * Which provider actually runs is chosen once, from VISION_PROVIDER, so
 * swapping vendors is a config change rather than a code change.
 */
@Injectable()
export class VisionService {
  private readonly provider: VisionProvider;

  constructor(
    config: ConfigService,
    anthropic: AnthropicVisionProvider,
    openai: OpenAiVisionProvider,
    gemini: GeminiVisionProvider,
  ) {
    const selected = (config.get<string>('ai.visionProvider') ??
      'anthropic') as AiProvider;
    const providers: Record<AiProvider, VisionProvider> = {
      anthropic,
      openai,
      gemini,
    };
    this.provider = providers[selected];
  }

  detectGarment(imageUrl: string): Promise<DetectedGarment> {
    return this.provider.detectGarment(imageUrl);
  }
}
