// Must run before any other import: src/auth/auth.ts builds a PrismaClient
// (for Better Auth's own DB access) at module-import time, which happens
// before NestJS — and @nestjs/config's dotenv loading — ever starts up.
// Without this, process.env.DATABASE_URL is still undefined when that
// client is constructed.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Better Auth needs to parse the raw request body itself;
    // @thallesp/nestjs-better-auth re-adds body parsing for every other route.
    bodyParser: false,
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
