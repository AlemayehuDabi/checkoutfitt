import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  DetectedGarment,
  GARMENT_DETECTION_PROMPT,
  GARMENT_JSON_SCHEMA,
  VisionProvider,
} from '../vision-provider.interface';

@Injectable()
export class OpenAiVisionProvider implements VisionProvider {
  private readonly logger = new Logger(OpenAiVisionProvider.name);
  private readonly model: string;
  private _client?: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.model = config.get<string>('ai.openaiVisionModel') ?? 'gpt-5.1';
  }

  // See AnthropicVisionProvider for why this is lazy: Nest instantiates all
  // three concrete providers regardless of which one VISION_PROVIDER
  // selects, and the OpenAI SDK throws in its constructor when no API key
  // is set.
  private get client(): OpenAI {
    if (!this._client) {
      this._client = new OpenAI({
        apiKey: this.config.get<string>('ai.openaiApiKey'),
      });
    }
    return this._client;
  }

  async detectGarment(imageUrl: string): Promise<DetectedGarment> {
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: GARMENT_DETECTION_PROMPT },
            { type: 'input_image', image_url: imageUrl, detail: 'auto' },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'garment',
          schema: GARMENT_JSON_SCHEMA,
          strict: true,
        },
      },
    });

    if (!response.output_text) {
      this.logger.error(`Empty OpenAI vision response for ${imageUrl}`);
      throw new Error('OpenAI vision response contained no output text');
    }
    return JSON.parse(response.output_text) as DetectedGarment;
  }
}
