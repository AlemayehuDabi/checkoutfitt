import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
  DetectedGarment,
  GARMENT_DETECTION_PROMPT,
  GARMENT_JSON_SCHEMA,
  VisionProvider,
} from '../vision-provider.interface';

@Injectable()
export class AnthropicVisionProvider implements VisionProvider {
  private readonly logger = new Logger(AnthropicVisionProvider.name);
  private readonly model: string;
  private _client?: Anthropic;

  constructor(private readonly config: ConfigService) {
    this.model =
      config.get<string>('ai.anthropicVisionModel') ?? 'claude-opus-5';
  }

  // Constructing the SDK client eagerly in the constructor would throw for
  // every registered provider at boot, not just the one VISION_PROVIDER
  // actually selects — Nest instantiates all three concrete providers
  // because VisionService takes each as a constructor dependency. Deferring
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

  async detectGarment(imageUrl: string): Promise<DetectedGarment> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      output_config: {
        format: { type: 'json_schema', schema: GARMENT_JSON_SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: imageUrl } },
            { type: 'text', text: GARMENT_DETECTION_PROMPT },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      this.logger.error(
        `No text block in Anthropic vision response for ${imageUrl}`,
      );
      throw new Error('Anthropic vision response contained no text');
    }
    return JSON.parse(textBlock.text) as DetectedGarment;
  }
}
