// The live run. There is no GPS in this build (the simulator has none), so distance comes from a
// simulated ticker: once a second the pace drifts inside 5:40 to 6:10 per km and the distance grows
// by that speed. Elapsed time is wall-clock while running, so a throttled timer (app in the
// background) catches up on the next tick; distance does not accrue across such a gap, and the gap
// is reported as a stalled signal, which is what a lost GPS fix does. Everything else (pause, resume,
// splits at each km, the final figures) is what a real tracker does.
import { useSyncExternalStore } from 'react';
import type { RunInput } from './runs';

/** Run seconds per real second. 1 is real time. A recording session may raise it so a short take
 *  accrues a visible distance; the delivery note must say so. */
export const TIME_SCALE = 1;

const PACE_MIN = 340; // 5:40 per km
const PACE_MAX = 370; // 6:10 per km
const TICK_MS = 1000;
const STALL_S = 5;

export type LiveStatus = 'idle' | 'acquiring' | 'running' | 'paused';

export type LiveState = {
  status: LiveStatus;
  startedAt: string | null;
  elapsedS: number;
  distanceM: number;
  /** Current pace, seconds per km. */
  paceS: number;
  /** Seconds per completed km, in order. */
  splits: number[];
  /** Elapsed seconds at the last km boundary. */
  lastSplitAtS: number;
  /** Seconds of the last stalled gap, 0 when the signal is continuous. */
  stalledS: number;
};

const initial: LiveState = {
  status: 'idle',
  startedAt: null,
  elapsedS: 0,
  distanceM: 0,
  paceS: 355,
  splits: [],
  lastSplitAtS: 0,
  stalledS: 0,
};

let state: LiveState = initial;
let timer: ReturnType<typeof setInterval> | null = null;
let lastTickMs = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function set(patch: Partial<LiveState>) {
  state = { ...state, ...patch };
  emit();
}

function tick() {
  const now = Date.now();
  const dtReal = (now - lastTickMs) / 1000;
  lastTickMs = now;
  const dt = dtReal * TIME_SCALE;
  if (dtReal > STALL_S) {
    set({ elapsedS: state.elapsedS + dt, stalledS: Math.round(dtReal) });
    return;
  }
  const paceS = Math.min(PACE_MAX, Math.max(PACE_MIN, state.paceS + (Math.random() - 0.5) * 4));
  const distanceM = state.distanceM + (1000 / paceS) * dt;
  const elapsedS = state.elapsedS + dt;
  const splits = [...state.splits];
  let lastSplitAtS = state.lastSplitAtS;
  while (distanceM >= (splits.length + 1) * 1000) {
    const overshootM = distanceM - (splits.length + 1) * 1000;
    const crossedAtS = elapsedS - overshootM * (paceS / 1000);
    splits.push(crossedAtS - lastSplitAtS);
    lastSplitAtS = crossedAtS;
  }
  set({ status: 'running', elapsedS, distanceM, paceS, splits, lastSplitAtS, stalledS: 0 });
}

function startTimer() {
  if (timer) clearInterval(timer);
  lastTickMs = Date.now();
  timer = setInterval(tick, TICK_MS);
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

export function startRun() {
  state = { ...initial, status: 'acquiring', startedAt: new Date().toISOString() };
  emit();
  startTimer();
}

export function pauseRun() {
  if (state.status !== 'running' && state.status !== 'acquiring') return;
  stopTimer();
  set({ status: 'paused', stalledS: 0 });
}

export function resumeRun() {
  if (state.status !== 'paused') return;
  set({ status: 'running' });
  startTimer();
}

export function resetRun() {
  stopTimer();
  state = initial;
  emit();
}

export function toRunInput(live: LiveState, place: string): RunInput {
  const fullKm = live.splits.length;
  const fullS = live.splits.reduce((a, b) => a + b, 0);
  return {
    startedAt: live.startedAt ?? new Date().toISOString(),
    place,
    splits: live.splits.map((s) => Math.round(s)),
    lastPartial: { meters: Math.round(live.distanceM - fullKm * 1000), seconds: Math.round(live.elapsedS - fullS) },
  };
}

export function useLive(): LiveState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}
