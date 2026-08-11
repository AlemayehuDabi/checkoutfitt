export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  betterAuth: {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
  },
  redis: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  ai: {
    visionProvider: process.env.VISION_PROVIDER ?? 'anthropic',
    llmProvider: process.env.LLM_PROVIDER ?? 'anthropic',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    anthropicVisionModel: process.env.ANTHROPIC_VISION_MODEL,
    anthropicLlmModel: process.env.ANTHROPIC_LLM_MODEL,
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiVisionModel: process.env.OPENAI_VISION_MODEL,
    openaiLlmModel: process.env.OPENAI_LLM_MODEL,
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiVisionModel: process.env.GEMINI_VISION_MODEL,
    geminiLlmModel: process.env.GEMINI_LLM_MODEL,
  },
});
