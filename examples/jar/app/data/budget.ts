// In-memory budget store for the example: four jars with weekly limits and three weeks of spends.
// There is no backend; load() simulates the first read so the loading and error states are real code
// paths, and the only rejections are validation ones. Screens subscribe with useBudget().
import { useSyncExternalStore } from 'react';
import { addDays, weekStart, weekdayIndex } from './format';
import { seedJars, seedSpends, type Jar, type JarId, type Spend } from './seed';

export type { Jar, JarId, Spend };

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

let status: LoadStatus = 'idle';
let jars: Jar[] = [];
let spends: Spend[] = [];
let version = 0;
let seq = 0;
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

export function useBudget(): number {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => version,
  );
}

export function getStatus(): LoadStatus {
  return status;
}

/** First read of the local data. Resolves after a short delay so the skeleton state is visible once. */
export function load(): Promise<void> {
  if (status === 'ready' || status === 'loading') return Promise.resolve();
  status = 'loading';
  emit();
  return new Promise((resolve) => {
    setTimeout(() => {
      jars = seedJars.map((j) => ({ ...j }));
      spends = seedSpends().sort(byNewest);
      status = 'ready';
      emit();
      resolve();
    }, 250);
  });
}

function byNewest(a: Spend, b: Spend): number {
  return b.at.localeCompare(a.at);
}

// Jars

export function listJars(): Jar[] {
  return jars;
}

export function getJar(id: JarId): Jar | undefined {
  return jars.find((j) => j.id === id);
}

export function totalLimit(): number {
  return jars.reduce((sum, j) => sum + j.limit, 0);
}

export function setLimits(limits: Record<JarId, number>): void {
  for (const id of Object.keys(limits) as JarId[]) {
    if (limits[id] < 0) throw new Error('Hạn mức không thể âm');
  }
  jars = jars.map((j) => ({ ...j, limit: limits[j.id] }));
  emit();
}

// Spends

export function listSpends(): Spend[] {
  return spends;
}

export function getSpend(id: string): Spend | undefined {
  return spends.find((s) => s.id === id);
}

export type SpendInput = { jarId: JarId; amount: number; place: string; at?: string };

/** Throws the message a screen shows inline when the input cannot be saved. */
export function validateSpend(input: SpendInput): void {
  if (status !== 'ready') throw new Error('Dữ liệu chưa sẵn sàng');
  if (!Number.isInteger(input.amount) || input.amount <= 0) throw new Error('Số tiền phải lớn hơn 0');
  if (!getJar(input.jarId)) throw new Error('Không có hũ này');
}

export function addSpend(input: SpendInput): Spend {
  validateSpend(input);
  const spend: Spend = {
    id: `s-${Date.now()}-${++seq}`,
    jarId: input.jarId,
    amount: input.amount,
    place: input.place.trim(),
    at: input.at ?? new Date().toISOString(),
  };
  spends = [spend, ...spends].sort(byNewest);
  emit();
  return spend;
}

export function updateSpend(id: string, patch: Partial<Pick<Spend, 'jarId' | 'amount' | 'place'>>): Spend {
  const current = getSpend(id);
  if (!current) throw new Error('Không tìm thấy khoản chi này');
  if (patch.amount !== undefined && (!Number.isInteger(patch.amount) || patch.amount <= 0)) throw new Error('Số tiền phải lớn hơn 0');
  const next: Spend = { ...current, ...patch, place: (patch.place ?? current.place).trim() };
  spends = spends.map((s) => (s.id === id ? next : s));
  emit();
  return next;
}

/** Removes the spend and returns it so the snackbar can restore it. */
export function removeSpend(id: string): Spend | undefined {
  const removed = getSpend(id);
  if (!removed) return undefined;
  spends = spends.filter((s) => s.id !== id);
  emit();
  return removed;
}

export function restoreSpend(spend: Spend): void {
  if (getSpend(spend.id)) return;
  spends = [spend, ...spends].sort(byNewest);
  emit();
}

// Selectors by week

export function spendsInWeek(start: Date): Spend[] {
  const from = start.getTime();
  const to = addDays(start, 7).getTime();
  return spends.filter((s) => {
    const t = new Date(s.at).getTime();
    return t >= from && t < to;
  });
}

export function spendsOnDay(day: Date): Spend[] {
  const from = new Date(day);
  from.setHours(0, 0, 0, 0);
  const to = addDays(from, 1);
  return spends.filter((s) => {
    const t = new Date(s.at).getTime();
    return t >= from.getTime() && t < to.getTime();
  });
}

export function weekTotal(start: Date): number {
  return spendsInWeek(start).reduce((sum, s) => sum + s.amount, 0);
}

export function spentByJar(start: Date): Record<JarId, number> {
  const out: Record<JarId, number> = { 'an-ngoai': 0, 'ca-phe': 0, 'di-lai': 0, khac: 0 };
  for (const s of spendsInWeek(start)) out[s.jarId] += s.amount;
  return out;
}

/** Spent in the week starting at start, counting only days up to and including weekday (0 = Monday). */
export function spentThroughWeekday(start: Date, weekday: number): number {
  const cutoff = addDays(start, weekday + 1).getTime();
  return spendsInWeek(start)
    .filter((s) => new Date(s.at).getTime() < cutoff)
    .reduce((sum, s) => sum + s.amount, 0);
}

/** This week's spend to date against last week's spend through the same weekday. Negative means less. */
export function comparedToLastWeek(now = new Date()): number {
  const thisStart = weekStart(now);
  const lastStart = addDays(thisStart, -7);
  const weekday = weekdayIndex(now);
  return spentThroughWeekday(thisStart, weekday) - spentThroughWeekday(lastStart, weekday);
}

/** Distinct places last used with this jar, newest first. */
export function recentPlaces(jarId: JarId, limit = 4): string[] {
  const out: string[] = [];
  for (const s of spends) {
    if (s.jarId !== jarId || !s.place) continue;
    if (!out.includes(s.place)) out.push(s.place);
    if (out.length >= limit) break;
  }
  return out;
}

/** Distinct weeks that have spends, newest first, as their Monday. */
export function weeksWithSpends(): Date[] {
  const seen = new Map<number, Date>();
  for (const s of spends) {
    const start = weekStart(new Date(s.at));
    seen.set(start.getTime(), start);
  }
  return Array.from(seen.values()).sort((a, b) => b.getTime() - a.getTime());
}
