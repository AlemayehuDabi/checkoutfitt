// Must run before any other import: src/auth/auth.ts builds a PrismaClient
// (for Better Auth's own DB access) at module-import time, which happens
// before NestJS — and @nestjs/config's dotenv loading — ever starts up.
// Without this, process.env.DATABASE_URL is still undefined when that
// client is constructed.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/** Expo dev server, Expo web, and a local Next.js client. */
const DEV_ORIGINS = [
  'http://localhost:8081',
  'http://localhost:19006',
  'http://localhost:3000',
  'http://localhost:3001',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Better Auth needs to parse the raw request body itself;
    // @thallesp/nestjs-better-auth re-adds body parsing for every other route.
    bodyParser: false,
  });

  // Native mobile requests carry no Origin header, so CORS doesn't affect
  // them; this is for the web client and Expo's dev server. Configured
  // origins replace the dev defaults in production.
  const config = app.get(ConfigService);
  const configured = config.get<string[]>('cors.origins') ?? [];
  app.enableCors({
    origin: configured.length > 0 ? configured : DEV_ORIGINS,
    credentials: true,
    // set-auth-token is how the bearer plugin hands the session token back.
    exposedHeaders: ['set-auth-token'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
