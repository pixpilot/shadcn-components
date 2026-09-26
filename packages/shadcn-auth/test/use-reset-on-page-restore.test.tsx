import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useResetOnPageRestore } from '../src/hooks/use-reset-on-page-restore';

function renderHook(onRestore: () => void) {
  function Probe() {
    useResetOnPageRestore(onRestore);
    return null;
  }
  return render(<Probe />);
}

function firePageShow(persisted: boolean) {
  act(() => {
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted }));
  });
}

describe('useResetOnPageRestore', () => {
  it('should run the callback when the page comes back from the back/forward cache', () => {
    const onRestore = vi.fn();
    renderHook(onRestore);

    firePageShow(true);

    expect(onRestore).toHaveBeenCalledTimes(1);
  });

  it('should ignore a fresh page load', () => {
    const onRestore = vi.fn();
    renderHook(onRestore);

    firePageShow(false);

    expect(onRestore).not.toHaveBeenCalled();
  });

  it('should stop listening once unmounted', () => {
    const onRestore = vi.fn();
    const { unmount } = renderHook(onRestore);

    unmount();
    firePageShow(true);

    expect(onRestore).not.toHaveBeenCalled();
  });
});
