import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

/*
 * jsdom ships no ResizeObserver, and the board's Radix popovers plus the
 * virtualizer construct one on mount. A no-op stands in: the tests assert on
 * markup and behaviour, never on measured sizes.
 */
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class ResizeObserverStub {
    observe(): void {
      // Sizes are never asserted on, so nothing needs to be reported.
    }

    unobserve(): void {
      // Nothing to stop observing.
    }

    disconnect(): void {
      // Nothing to disconnect.
    }
  } as unknown as typeof globalThis.ResizeObserver;
}

afterEach(() => {
  cleanup();
});
