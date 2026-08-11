import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { APIError } from 'better-auth/api';

/**
 * Better Auth's own error codes don't map 1:1 onto the HTTP status the task
 * spec wants (e.g. duplicate email should read as 409, not Better Auth's
 * default 422). Extend this map as new Better Auth error codes need a
 * different status than the one Better Auth ships with.
 */
const BETTER_AUTH_CODE_STATUS_OVERRIDES: Record<string, number> = {
  USER_ALREADY_EXISTS: HttpStatus.CONFLICT,
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: HttpStatus.CONFLICT,
  EMAIL_ALREADY_EXISTS: HttpStatus.CONFLICT,
  CREDENTIAL_ACCOUNT_NOT_FOUND: HttpStatus.UNAUTHORIZED,
  INVALID_EMAIL_OR_PASSWORD: HttpStatus.UNAUTHORIZED,
  INVALID_PASSWORD: HttpStatus.UNAUTHORIZED,
  INVALID_TOKEN: HttpStatus.UNAUTHORIZED,
};

interface ErrorResponseBody {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{ url: string }>();

    const body = this.buildBody(exception, request.url);

    if (body.statusCode >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(body.statusCode).json(body);
  }

  private buildBody(exception: unknown, path: string): ErrorResponseBody {
    const timestamp = new Date().toISOString();

    if (exception instanceof APIError) {
      const code = exception.body?.code;
      const statusCode =
        (code ? BETTER_AUTH_CODE_STATUS_OVERRIDES[code] : undefined) ??
        exception.statusCode;
      return {
        statusCode,
        error: code ?? String(exception.status),
        message: exception.body?.message ?? exception.message,
        path,
        timestamp,
      };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'string'
          ? payload
          : ((payload as { message?: string | string[] }).message ??
            exception.message);
      return {
        statusCode,
        error: HttpStatus[statusCode] ?? exception.name,
        message,
        path,
        timestamp,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      path,
      timestamp,
    };
  }
}
