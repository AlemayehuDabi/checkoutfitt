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
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(config: ConfigService) {
    this.client = new Anthropic({
      apiKey: config.get<string>('ai.anthropicApiKey'),
    });
    this.model =
      config.get<string>('ai.anthropicVisionModel') ?? 'claude-opus-5';
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
