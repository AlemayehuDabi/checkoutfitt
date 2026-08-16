import { Throttle } from '@nestjs/throttler';

export const RATE_LIMIT_WINDOW_MS = 60_000;

/** Ordinary CRUD: generous enough that normal app use never notices. */
export const DEFAULT_RATE_LIMIT = 100;

/**
 * Endpoints that spend money on a vendor call. Deliberately much tighter —
 * these are seconds-long requests, so a legitimate user can't reasonably
 * issue more than a handful a minute anyway.
 */
export const AI_RATE_LIMIT = 15;

/** Applies the AI budget to a route, overriding the global default. */
export const AiRateLimit = () =>
  Throttle({
    default: { limit: AI_RATE_LIMIT, ttl: RATE_LIMIT_WINDOW_MS },
  });
