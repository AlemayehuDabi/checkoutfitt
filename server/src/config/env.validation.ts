import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { AI_PROVIDERS } from '../ai/constants';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  BETTER_AUTH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  BETTER_AUTH_URL: string;

  @IsOptional()
  @IsString()
  PORT?: string;

  @IsOptional()
  @IsString()
  REDIS_URL?: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string;

  // Only the provider actually selected by VISION_PROVIDER/LLM_PROVIDER needs
  // its key set — a missing key for an unused provider is fine, it's just
  // never instantiated with real credentials. All three are optional here so
  // boot doesn't require signing up for vendors you don't use.
  @IsOptional()
  @IsIn(AI_PROVIDERS)
  VISION_PROVIDER?: string;

  @IsOptional()
  @IsIn(AI_PROVIDERS)
  LLM_PROVIDER?: string;

  @IsOptional()
  @IsString()
  ANTHROPIC_API_KEY?: string;

  @IsOptional()
  @IsString()
  OPENAI_API_KEY?: string;

  @IsOptional()
  @IsString()
  GEMINI_API_KEY?: string;

  @IsOptional()
  @IsString()
  OPENWEATHER_API_KEY?: string;

  // Password-reset email. Without a key the reset link is logged to the
  // console instead, so local development still works end to end.
  @IsOptional()
  @IsString()
  RESEND_API_KEY?: string;

  @IsOptional()
  @IsString()
  FROM_EMAIL?: string;

  // Comma-separated browser origins allowed by CORS.
  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n${errors.toString()}`);
  }

  return validated;
}
