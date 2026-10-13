// Formatting and week arithmetic. VND has no decimals; amounts are grouped with dots and carry a thin
// space before the sign (420.000 ₫). Weeks run Monday to Sunday in the device's local time.

const THIN_SPACE = ' ';
const MINUS = '−';

export function groupDigits(n: number): string {
  return String(Math.abs(Math.trunc(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 420.000 ₫; negative values get a true minus sign, never rounded. */
export function formatVnd(n: number): string {
  return `${n < 0 ? MINUS : ''}${groupDigits(n)}${THIN_SPACE}₫`;
}

/** Signed form for comparisons: +12.000 ₫ or −214.000 ₫. */
export function formatSignedVnd(n: number): string {
  return n > 0 ? `+${formatVnd(n)}` : formatVnd(n);
}

export const WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;
export const WEEKDAY_LONG = ['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật'] as const;

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Monday 00:00 of the week containing d. */
export function weekStart(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() - weekdayIndex(x));
  return x;
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** Days from today through Sunday, inclusive (Tuesday → 6, Sunday → 1). */
export function daysLeftInWeek(now: Date): number {
  return 7 - weekdayIndex(now);
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dayMonth(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

/** "Hôm nay, thứ Ba 13/10", "Hôm qua, thứ Hai 12/10", or "Thứ Sáu 10/10". */
export function dayLabel(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const weekday = WEEKDAY_LONG[weekdayIndex(d)];
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  if (sameDay(d, now)) return `Hôm nay, ${weekday} ${dayMonth(d)}`;
  if (sameDay(d, addDays(now, -1))) return `Hôm qua, ${weekday} ${dayMonth(d)}`;
  return `${capitalized} ${dayMonth(d)}`;
}

/** "Tuần này", "Tuần trước", or "Tuần 28/9". */
export function weekLabel(start: Date, now = new Date()): string {
  const thisWeek = weekStart(now);
  if (sameDay(start, thisWeek)) return 'Tuần này';
  if (sameDay(start, addDays(thisWeek, -7))) return 'Tuần trước';
  return `Tuần ${dayMonth(start)}`;
}

/** "12/10 đến 18/10" for the week starting at start. */
export function weekRangeLabel(start: Date): string {
  return `${dayMonth(start)} đến ${dayMonth(addDays(start, 6))}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatTime(iso)}, ${WEEKDAY_LONG[weekdayIndex(d)]} ${dayMonth(d)}`;
}
