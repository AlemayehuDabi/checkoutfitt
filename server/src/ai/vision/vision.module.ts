import { Module } from '@nestjs/common';
import { VisionService } from './vision.service';
import { AnthropicVisionProvider } from './providers/anthropic-vision.provider';
import { OpenAiVisionProvider } from './providers/openai-vision.provider';
import { GeminiVisionProvider } from './providers/gemini-vision.provider';

@Module({
  providers: [
    VisionService,
    AnthropicVisionProvider,
    OpenAiVisionProvider,
    GeminiVisionProvider,
  ],
  exports: [VisionService],
})
export class VisionModule {}
