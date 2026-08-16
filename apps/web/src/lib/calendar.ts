/** Calendar grid maths. All dates are handled as UTC-midnight, date-only —
 *  the same convention as the backend's `@db.Date` column. */

export interface CalendarDay {
  /** YYYY-MM-DD */
  key: string;
  date: Date;
  dayOfMonth: number;
  inMonth: boolean;
  isToday: boolean;
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/** Today as UTC-midnight, so comparisons are day-level not instant-level. */
export function todayKey(): string {
  const now = new Date();
  return toKey(utcDate(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/**
 * Six weeks of days covering the month, padded with leading/trailing days
 * from the neighbouring months. Always 42 cells so the grid never changes
 * height as you page through — a calendar that jumps is disorienting.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[][] {
  const first = utcDate(year, month, 1);
  const leading = first.getUTCDay();
  const start = addDays(first, -leading);
  const today = todayKey();

  const weeks: CalendarDay[][] = [];
  for (let week = 0; week < 6; week++) {
    const days: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      const date = addDays(start, week * 7 + day);
      const key = toKey(date);
      days.push({
        key,
        date,
        dayOfMonth: date.getUTCDate(),
        inMonth: date.getUTCMonth() === month,
        isToday: key === today,
      });
    }
    weeks.push(days);
  }
  return weeks;
}

/** Just the in-month days, for the narrow-viewport strip. */
export function buildMonthStrip(year: number, month: number): CalendarDay[] {
  const today = todayKey();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = utcDate(year, month, i + 1);
    const key = toKey(date);
    return {
      key,
      date,
      dayOfMonth: i + 1,
      inMonth: true,
      isToday: key === today,
    };
  });
}

export function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate(year, month, 1));
}

export function longDate(key: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00Z`));
}

export function isPast(key: string): boolean {
  return key < todayKey();
}
