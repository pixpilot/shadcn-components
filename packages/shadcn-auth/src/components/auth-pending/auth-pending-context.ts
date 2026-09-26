'use client';

import { createContext, use, useMemo } from 'react';

import { usePendingAction } from '../../hooks/use-pending-action';
import { useResetOnPageRestore } from '../../hooks/use-reset-on-page-restore';

/** Key for the button that submits the card's main form. */
export const AUTH_SUBMIT_ACTION = 'submit';

export interface AuthPendingValue {
  /** Key of the button whose action is running, or `null` when none is. */
  pendingKey: string | null;
  /**
   * Whether anything on the card is in flight — an action started here, or work
   * the host reported through `isLoading`. The cue for disabling every control.
   */
  isBusy: boolean;
  /** Starts `action`, marking `key` as the button that should spin meanwhile. */
  run: (key: string, action: () => Promise<void>) => void;
}

export const AuthPendingContext = createContext<AuthPendingValue | null>(null);

/**
 * Creates the pending scope for one auth card.
 *
 * Every button on a card shares one scope, which is what lets the pressed
 * button spin while its neighbours only go disabled: a single `isLoading` flag
 * can say that something is happening but not what, so driving spinners from it
 * lights up every button at once.
 *
 * `isLoading` is the host's own flag. It disables the card but spins nothing,
 * since the host cannot know which button the user pressed.
 */
export function useAuthPendingState(isLoading = false): AuthPendingValue {
  const pending = usePendingAction();

  // OAuth leaves this page mid-flight, so a button is still spinning when the
  // browser navigates away. Returning with Back restores the document — this
  // state included — and the spinner would otherwise run over a dead page.
  useResetOnPageRestore(pending.reset);

  const { pendingKey, isPending, run } = pending;
  return useMemo(
    () => ({ pendingKey, isBusy: isLoading || isPending, run }),
    [pendingKey, isLoading, isPending, run],
  );
}

/**
 * The pending scope this component sits in.
 *
 * Falls back to a scope of its own when there is no provider above, so a
 * component exported from this package still behaves when a host drops it onto
 * a page of their own rather than inside one of the auth cards.
 */
export function useAuthPending(isLoading = false): AuthPendingValue {
  const inherited = use(AuthPendingContext);
  const standalone = useAuthPendingState(isLoading);
  return inherited ?? standalone;
}
