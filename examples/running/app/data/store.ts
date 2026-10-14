// A small external store with an async hydration step, so every screen has a real loading, error
// and populated state. There is no storage layer in this example; load() resolves the seed after a
// short delay the way a storage read would, and a throw inside it is the error state.
import { useSyncExternalStore } from 'react';

export type Status = 'loading' | 'ready' | 'error';

export type Snapshot<T> = { status: Status; value: T | undefined };

export function createStore<T>(load: () => Promise<T>) {
  let status: Status = 'loading';
  let value: T | undefined;
  let snapshot: Snapshot<T> = { status, value };
  const listeners = new Set<() => void>();

  function emit() {
    snapshot = { status, value };
    listeners.forEach((l) => l());
  }

  async function hydrate() {
    status = 'loading';
    emit();
    try {
      value = await load();
      status = 'ready';
    } catch {
      status = 'error';
    }
    emit();
  }

  void hydrate();

  return {
    use(): Snapshot<T> {
      return useSyncExternalStore(
        (l) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        () => snapshot,
      );
    },
    get(): T | undefined {
      return value;
    },
    set(next: T) {
      value = next;
      emit();
    },
    retry: hydrate,
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
