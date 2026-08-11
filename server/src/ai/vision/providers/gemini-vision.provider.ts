import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { fetchImageAsBase64 } from '../../image-fetch.util';
import {
  DetectedGarment,
  GARMENT_DETECTION_PROMPT,
  GARMENT_JSON_SCHEMA,
  VisionProvider,
} from '../vision-provider.interface';

@Injectable()
export class GeminiVisionProvider implements VisionProvider {
  private readonly logger = new Logger(GeminiVisionProvider.name);
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(config: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: config.get<string>('ai.geminiApiKey'),
    });
    this.model =
      config.get<string>('ai.geminiVisionModel') ?? 'gemini-pro-latest';
  }

  async detectGarment(imageUrl: string): Promise<DetectedGarment> {
    // Unlike Anthropic/OpenAI, Gemini's public API has no generic
    // arbitrary-URL image part, so the image is fetched and inlined.
    const { data, mimeType } = await fetchImageAsBase64(imageUrl);

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: GARMENT_DETECTION_PROMPT },
            { inlineData: { data, mimeType } },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: GARMENT_JSON_SCHEMA,
      },
    });

    if (!response.text) {
      this.logger.error(`Empty Gemini vision response for ${imageUrl}`);
      throw new Error('Gemini vision response contained no text');
    }
    return JSON.parse(response.text) as DetectedGarment;
  }
}
