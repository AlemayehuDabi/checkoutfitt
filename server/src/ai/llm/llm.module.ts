import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';
import { AnthropicLlmProvider } from './providers/anthropic-llm.provider';
import { OpenAiLlmProvider } from './providers/openai-llm.provider';
import { GeminiLlmProvider } from './providers/gemini-llm.provider';

@Module({
  providers: [
    LLMService,
    AnthropicLlmProvider,
    OpenAiLlmProvider,
    GeminiLlmProvider,
  ],
  exports: [LLMService],
})
export class LlmModule {}
