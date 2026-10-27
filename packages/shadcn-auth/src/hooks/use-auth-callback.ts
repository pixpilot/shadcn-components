'use client';

import { useEffect, useRef, useState } from 'react';
import { readCallbackParams } from '../utils/read-callback-params';

/** How long the success message shows before `onDone` runs. */
const DEFAULT_CLOSE_DELAY_MS = 2000;

export type AuthCallbackStatus =
  | { kind: 'loading' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

export interface UseAuthCallbackOptions {
  /**
   * Exchanges the code for a session, such as by messaging a browser
   * extension's background. A rejection's message is shown as the error.
   */
  exchangeCode: (params: { code: string; state: string }) => Promise<void>;
  /** The callback URL; the current page's by default. */
  url?: string;
  /** Runs `closeDelayMs` after a successful sign-in; `window.close` by default. */
  onDone?: () => void;
  /** Defaults to 2000. */
  closeDelayMs?: number;
}

/**
 * Drives the page a sign-in redirects back to: reads the code from the URL,
 * hands it to `exchangeCode` once, and reports where that stands. Pair it with
 * `AuthCallbackScreen`, or render the status yourself.
 */
export function useAuthCallback({
  exchangeCode,
  url,
  onDone,
  closeDelayMs = DEFAULT_CLOSE_DELAY_MS,
}: UseAuthCallbackOptions): AuthCallbackStatus {
  const [status, setStatus] = useState<AuthCallbackStatus>({ kind: 'loading' });
  // A code is single-use: sending it again (React's Strict Mode runs effects
  // twice in development) would fail the sign-in that just succeeded.
  const sent = useRef(false);
  // Callbacks are read when they run, so inline functions don't re-run the effect.
  const latest = useRef({ exchangeCode, onDone, closeDelayMs });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    latest.current = { exchangeCode, onDone, closeDelayMs };
  }, [exchangeCode, onDone, closeDelayMs]);

  useEffect(() => {
    if (sent.current) {
      return;
    }
    sent.current = true;
    const params = readCallbackParams(url ?? window.location.href);
    if (!params.ok) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setStatus({ kind: 'error', message: params.error });
      return;
    }
    latest.current
      .exchangeCode({ code: params.code, state: params.state })
      .then(() => {
        setStatus({ kind: 'success' });
        const { onDone: done = () => window.close(), closeDelayMs: delay } =
          latest.current;
        closeTimer.current = setTimeout(done, delay);
      })
      .catch((error: unknown) => {
        setStatus({
          kind: 'error',
          message:
            error instanceof Error ? error.message : 'Sign-in failed. Please try again.',
        });
      });
  }, [url]);

  return status;
}
