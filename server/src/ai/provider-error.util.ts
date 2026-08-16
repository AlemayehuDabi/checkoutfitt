import {
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

/**
 * Digs an HTTP status out of a vendor SDK error. The three SDKs don't agree
 * on where it lives — some expose a numeric `status`, and Gemini reports it
 * only inside the JSON body of the error message.
 */
export function extractProviderStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      status?: unknown;
      code?: unknown;
      response?: { status?: unknown };
    };
    for (const value of [
      candidate.status,
      candidate.code,
      candidate.response?.status,
    ]) {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        return Number(value);
      }
    }
  }

  const match =
    error instanceof Error ? /"code"\s*:\s*(\d{3})/.exec(error.message) : null;
  return match ? Number(match[1]) : undefined;
}

/**
 * Translates a vendor SDK failure into an HTTP error, so an upstream problem
 * never escapes as an unhandled 500 — the same convention the weather
 * provider already follows.
 *
 * Quota/rate-limit responses stay 429 rather than collapsing into 503: those
 * are throttling for the caller to wait out, not a broken provider, and a
 * client should back off instead of treating it as an outage. The original
 * error is always logged so real bugs behind either status stay diagnosable.
 */
export function toProviderHttpException(
  error: unknown,
  context: string,
  logger: Logger,
): HttpException {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`${context} failed: ${message}`);

  if (extractProviderStatus(error) === HttpStatus.TOO_MANY_REQUESTS) {
    return new HttpException(
      'The AI provider is rate limited right now. Please try again shortly.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
  return new ServiceUnavailableException(
    'The AI provider is currently unavailable. Please try again shortly.',
  );
}
