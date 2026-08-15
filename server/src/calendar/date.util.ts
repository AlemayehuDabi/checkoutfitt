import { BadRequestException } from '@nestjs/common';

/** `YYYY-MM-DD` — the wire format for every calendar date (body, path, query). */
export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
/** `YYYY-MM` — the wire format for the month filter. */
export const MONTH_PATTERN = /^\d{4}-\d{2}$/;

/**
 * Parses a `YYYY-MM-DD` string into a UTC-midnight Date.
 *
 * Everything about the calendar is date-only: the column is a PostgreSQL
 * DATE, and Prisma reads/writes those as UTC-midnight Dates. Anchoring at
 * UTC midnight here means the value written is the same calendar square the
 * user typed, with no timezone shifting it a day either way.
 *
 * `Date.UTC` silently rolls overflow over (Feb 30 -> Mar 2), so the parsed
 * result is checked against the input rather than trusted.
 */
export function parseDateOnly(value: string): Date {
  if (!DATE_ONLY_PATTERN.test(value)) {
    throw new BadRequestException(
      `Invalid date "${value}" — expected format YYYY-MM-DD`,
    );
  }
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new BadRequestException(`Invalid date "${value}" — no such day`);
  }
  return parsed;
}

/** Formats a date-only Date back to `YYYY-MM-DD` for responses. */
export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today as a UTC-midnight Date, for comparing against scheduled dates. */
export function todayDateOnly(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

/**
 * Half-open `[start, end)` bounds for a `YYYY-MM` month. Exclusive upper
 * bound avoids having to know the month's last day, and `Date.UTC` handles
 * the December -> January rollover on its own.
 */
export function parseMonthRange(value: string): { start: Date; end: Date } {
  if (!MONTH_PATTERN.test(value)) {
    throw new BadRequestException(
      `Invalid month "${value}" — expected format YYYY-MM`,
    );
  }
  const [year, month] = value.split('-').map(Number);
  if (month < 1 || month > 12) {
    throw new BadRequestException(`Invalid month "${value}" — no such month`);
  }
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
}

/** The current `YYYY-MM`, used when the month query param is omitted. */
export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}
