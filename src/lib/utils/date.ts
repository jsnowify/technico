/**
 * Small date helpers for DatePicker. No date-fns/dayjs here on
 * purpose — nothing else in this codebase pulls in a date library,
 * and a calendar grid + ISO formatting is little enough logic that
 * adding one would just be extra bundle weight. Everything here
 * treats dates as local calendar days; timezone math lives in
 * lib/utils/timezone.ts instead.
 */

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Sunday-first 6x7 grid of dates covering `month`'s calendar sheet,
 * including the leading/trailing days from adjacent months needed to
 * fill whole weeks — matches the US/Canada week convention the rest
 * of the site's audience (see SITE_PHONE) is built around.
 */
export function getCalendarGrid(month: Date): Date[] {
  const firstOfMonth = startOfMonth(month);
  const leadingDays = firstOfMonth.getDay(); // 0 (Sun) .. 6 (Sat)
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - leadingDays);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}
