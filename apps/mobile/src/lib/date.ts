/** Small date helpers shared by the Outfit Calendar and Travel Packing flows. */

export const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"] as const;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** `YYYY-MM-DD` in local time — the key format used across calendar state. */
export function toISODate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function monthLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function addDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Weekday index (0 = Sunday) that the 1st of the month falls on. */
export function startWeekday(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

/** "Mon 14 Aug" — compact display used in day details and packing headers. */
export function shortDate(iso: string): string {
  const date = fromISODate(iso);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  return `${weekday} ${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

export function daysBetween(startISO: string, endISO: string): number {
  const ms = fromISODate(endISO).getTime() - fromISODate(startISO).getTime();
  return Math.round(ms / 86_400_000);
}
