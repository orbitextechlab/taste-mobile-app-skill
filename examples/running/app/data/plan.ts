// This week's plan: a weekday template applied to the current week, so the week never goes stale.
// A day is done when a run was saved on that date (data/runs.ts); the plan stores nothing itself.
import { createStore, delay } from './store';
import { dateKey, startOfWeek, weekdayShort } from './runs';

export type Kind = 'dễ' | 'dài';

/** weekday 1 = Monday to 7 = Sunday. */
export type Session = { weekday: number; km: number; kind: Kind };

export type PlanDay = { date: Date; key: string; label: string; session?: Session; isToday: boolean };

export const DEFAULT_PLAN: Session[] = [
  { weekday: 1, km: 5, kind: 'dễ' },
  { weekday: 2, km: 6, kind: 'dễ' },
  { weekday: 4, km: 6, kind: 'dễ' },
  { weekday: 6, km: 10, kind: 'dài' },
];

const store = createStore<Session[]>(async () => {
  await delay(300);
  return DEFAULT_PLAN;
});

export const usePlan = store.use;
export const retryPlan = store.retry;

export function useDefaultPlan() {
  store.set(DEFAULT_PLAN);
}

export function weekDays(sessions: Session[], now = new Date()): PlanDay[] {
  const monday = startOfWeek(now);
  const todayKey = dateKey(now);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const key = dateKey(date);
    return { date, key, label: weekdayShort(date), session: sessions.find((s) => s.weekday === i + 1), isToday: key === todayKey };
  });
}

export function sessionOn(sessions: Session[], date: Date): Session | undefined {
  const weekday = ((date.getDay() + 6) % 7) + 1;
  return sessions.find((s) => s.weekday === weekday);
}

export function weekTotalKm(sessions: Session[]): number {
  return sessions.reduce((a, s) => a + s.km, 0);
}

export function kindLabel(kind: Kind): string {
  return kind === 'dài' ? 'chạy dài' : 'chạy dễ';
}
