'use client';

import { useCallback, useState } from 'react';

export interface PendingAction<TKey extends string> {
  /** Key of the action currently in flight, or `null` when none is. */
  pendingKey: TKey | null;
  /** Whether an action is in flight — the cue for disabling the others. */
  isPending: boolean;
  /** Starts `action` and marks `key` as the one running until it settles. */
  run: (key: TKey, action: () => Promise<void>) => void;
  /** Clears the pending key without waiting for its action to settle. */
  reset: () => void;
}

/**
 * Tracks *which* of several buttons started the work in flight.
 *
 * A single `isLoading` flag can only say that something is happening, not what
 * — so a row of buttons sharing one flag spins every one of them when a user
 * clicks a single button. Keeping the key of the action that actually started
 * lets the button the user pressed show the spinner while its neighbours only
 * go disabled.
 *
 * An action that navigates away (an OAuth redirect) never settles, so the
 * spinner deliberately keeps running until the page is gone.
 */
export function usePendingAction<TKey extends string = string>(): PendingAction<TKey> {
  const [pendingKey, setPendingKey] = useState<TKey | null>(null);

  const reset = useCallback(() => setPendingKey(null), []);

  const run = useCallback((key: TKey, action: () => Promise<void>) => {
    setPendingKey(key);
    action()
      // The handler owns error reporting — it routes failures into the shared
      // banner. Catching here keeps a rejected promise from going unhandled.
      .catch(console.error)
      .finally(() => setPendingKey(null));
  }, []);

  return { pendingKey, isPending: pendingKey != null, run, reset };
}
