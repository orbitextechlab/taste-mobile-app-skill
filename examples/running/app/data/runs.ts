// In-memory run store for the example. A run is what a tracker would persist after a finish: when it
// started, where, the per-km splits and the last partial km. Distance and duration are derived from
// the splits so the seed cannot contradict itself. Screens subscribe with useRuns().
import { createStore, delay } from './store';

export type Partial = { meters: number; seconds: number };

export type Run = {
  id: string;
  startedAt: string;
  place: string;
  /** Seconds per full kilometre, in order. */
  splits: number[];
  lastPartial: Partial;
  distanceM: number;
  durationS: number;
};

export type RunInput = Omit<Run, 'id' | 'distanceM' | 'durationS'>;

function derive(input: RunInput, id: string): Run {
  const full = input.splits.reduce((a, b) => a + b, 0);
  return {
    ...input,
    id,
    distanceM: input.splits.length * 1000 + input.lastPartial.meters,
    durationS: full + input.lastPartial.seconds,
  };
}

const seed: RunInput[] = [
  { startedAt: '2026-10-12T05:38:00+07:00', place: 'Công viên Gia Định', splits: [352, 346, 349, 344, 351], lastPartial: { meters: 210, seconds: 73 } },
  { startedAt: '2026-10-10T18:05:00+07:00', place: 'Phú Mỹ Hưng', splits: [361, 358, 364, 366, 360, 369, 362, 358], lastPartial: { meters: 40, seconds: 15 } },
  { startedAt: '2026-10-08T05:41:00+07:00', place: 'Thảo Điền', splits: [349, 345, 350, 347, 352, 344], lastPartial: { meters: 120, seconds: 42 } },
  { startedAt: '2026-10-05T06:02:00+07:00', place: 'Công viên Gia Định', splits: [366, 362, 365, 360, 368, 364, 363, 370, 361, 358], lastPartial: { meters: 30, seconds: 11 } },
  { startedAt: '2026-10-03T18:20:00+07:00', place: 'Công viên Lê Văn Tám', splits: [347, 344, 348, 343, 346], lastPartial: { meters: 50, seconds: 17 } },
  { startedAt: '2026-10-01T05:45:00+07:00', place: 'Thảo Điền', splits: [351, 348, 350, 346, 349, 352], lastPartial: { meters: 480, seconds: 168 } },
  { startedAt: '2026-09-28T05:50:00+07:00', place: 'Bờ kè Hoàng Sa', splits: [360, 356, 359, 355, 361, 357, 358], lastPartial: { meters: 200, seconds: 72 } },
  { startedAt: '2026-09-26T18:10:00+07:00', place: 'Phú Mỹ Hưng', splits: [349, 345, 347, 342, 350], lastPartial: { meters: 0, seconds: 0 } },
  { startedAt: '2026-09-23T05:36:00+07:00', place: 'Công viên Gia Định', splits: [353, 350, 352, 348, 355, 349], lastPartial: { meters: 300, seconds: 106 } },
  { startedAt: '2026-09-20T06:10:00+07:00', place: 'Khu đô thị Sala', splits: [368, 363, 366, 362, 369, 365, 364, 370, 367, 361, 366, 363], lastPartial: { meters: 100, seconds: 37 } },
];

const store = createStore<Run[]>(async () => {
  await delay(300);
  return seed.map((r) => derive(r, `run-${r.startedAt.slice(0, 10)}-${r.startedAt.slice(11, 16).replace(':', '')}`));
});

export const useRuns = store.use;
export const retryRuns = store.retry;

function byNewest(a: Run, b: Run) {
  return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
}

export function listRuns(): Run[] {
  return [...(store.get() ?? [])].sort(byNewest);
}

export function getRun(id: string): Run | undefined {
  return store.get()?.find((r) => r.id === id);
}

export function latestRun(): Run | undefined {
  return listRuns()[0];
}

export function runsOn(key: string): Run[] {
  return listRuns().filter((r) => dateKey(new Date(r.startedAt)) === key);
}

/** Places by how often they were run, most frequent first. */
export function rankedPlaces(): string[] {
  const counts = new Map<string, number>();
  for (const r of listRuns()) counts.set(r.place, (counts.get(r.place) ?? 0) + 1);
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([place]) => place);
}

export const MIN_SAVE_M = 100;

export async function saveRun(input: RunInput): Promise<Run> {
  const run = derive(input, `run-${Date.now()}`);
  if (run.distanceM < MIN_SAVE_M) throw new Error(`Chưa đủ ${MIN_SAVE_M} m để lưu`);
  await delay(150);
  store.set([run, ...(store.get() ?? [])]);
  return run;
}

export function deleteRun(id: string): Run | undefined {
  const current = store.get() ?? [];
  const run = current.find((r) => r.id === id);
  if (!run) return undefined;
  store.set(current.filter((r) => r.id !== id));
  return run;
}

export function restoreRun(run: Run) {
  const current = store.get() ?? [];
  if (current.some((r) => r.id === run.id)) return;
  store.set([run, ...current]);
}

export function averagePace(run: Pick<Run, 'distanceM' | 'durationS'>): number {
  return run.distanceM > 0 ? run.durationS / (run.distanceM / 1000) : 0;
}

export function fastestSplit(run: Run): number {
  if (run.splits.length === 0) return -1;
  return run.splits.indexOf(Math.min(...run.splits));
}

// Formatting. Vietnamese locale: decimal comma, 24 h clock, weekday as T2 to T7 and CN.

export function formatKm(meters: number): string {
  return (meters / 1000).toFixed(1).replace('.', ',');
}

export function formatPlanKm(km: number): string {
  return Number.isInteger(km) ? String(km) : km.toFixed(1).replace('.', ',');
}

export function formatPace(secondsPerKm: number): string {
  const s = Math.round(secondsPerKm);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

export function formatTime(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEKDAY_LONG = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function weekdayShort(d: Date): string {
  return WEEKDAY_SHORT[d.getDay()];
}

export function formatDayShort(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return `${weekdayShort(d)} ${d.getDate()}/${d.getMonth() + 1}`;
}

export function formatDayLong(d: Date): string {
  return `${WEEKDAY_LONG[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`;
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Monday 00:00 local of the week containing d. */
export function startOfWeek(d: Date): Date {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const offset = (out.getDay() + 6) % 7;
  out.setDate(out.getDate() - offset);
  return out;
}

export function weekLabel(monday: Date, now = new Date()): string {
  const thisMonday = startOfWeek(now);
  const weeks = Math.round((thisMonday.getTime() - monday.getTime()) / (7 * 86_400_000));
  if (weeks === 0) return 'Tuần này';
  if (weeks === 1) return 'Tuần trước';
  return `Tuần ${monday.getDate()}/${monday.getMonth() + 1}`;
}

export function relativeDay(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const days = Math.round((startOfDay(now).getTime() - startOfDay(d).getTime()) / 86_400_000);
  if (days === 0) return 'hôm nay';
  if (days === 1) return 'hôm qua';
  return formatDayShort(d);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
