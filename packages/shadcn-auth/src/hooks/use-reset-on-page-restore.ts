'use client';

import { useEffect, useRef } from 'react';

/**
 * Runs `onRestore` when the browser shows this page again from its
 * back/forward cache.
 *
 * OAuth leaves the page mid-flight: the provider URL is cross-origin, so the
 * button is still spinning when the browser navigates away. Coming back with
 * the Back button restores the document — React state included — exactly as it
 * was left, and the spinner keeps running over a page that is no longer doing
 * anything. A page that reloads instead starts from fresh state and needs
 * nothing; only the restored one does.
 */
export function useResetOnPageRestore(onRestore: () => void): void {
  const onRestoreRef = useRef(onRestore);

  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        onRestoreRef.current();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);
}
