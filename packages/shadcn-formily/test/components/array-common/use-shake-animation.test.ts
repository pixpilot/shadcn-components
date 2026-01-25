import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useShakeAnimation } from '../../../src/components/array-common/use-shake-animation';

beforeEach(() => {
  vi.useFakeTimers();
  // Mock requestAnimationFrame to be synchronous for testing
  vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0);
    return 1;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('useShakeAnimation', () => {
  it('should return shouldShake as false initially', () => {
    const { result } = renderHook(() => useShakeAnimation());

    expect(result.current.shouldShake).toBe(false);
    expect(typeof result.current.triggerShake).toBe('function');
  });

  it('should trigger shake animation when triggerShake is called', () => {
    const { result } = renderHook(() => useShakeAnimation());

    act(() => {
      result.current.triggerShake();
    });

    expect(result.current.shouldShake).toBe(true);
  });

  it('should reset shake after timeout', () => {
    const { result } = renderHook(() => useShakeAnimation());

    act(() => {
      result.current.triggerShake();
    });

    expect(result.current.shouldShake).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(320);
    });

    expect(result.current.shouldShake).toBe(false);
  });

  it('should clear existing timeout when triggerShake is called again', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { result } = renderHook(() => useShakeAnimation());

    act(() => {
      result.current.triggerShake();
    });

    expect(clearTimeoutSpy).not.toHaveBeenCalled();

    act(() => {
      result.current.triggerShake();
    });

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    clearTimeoutSpy.mockRestore();
  });

  it('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { result, unmount } = renderHook(() => useShakeAnimation());

    act(() => {
      result.current.triggerShake();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    clearTimeoutSpy.mockRestore();
  });

  it('should handle multiple rapid triggerShake calls', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { result } = renderHook(() => useShakeAnimation());

    act(() => {
      result.current.triggerShake();
      result.current.triggerShake();
      result.current.triggerShake();
    });

    expect(result.current.shouldShake).toBe(true);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2); // First call doesn't clear, subsequent ones do

    clearTimeoutSpy.mockRestore();
  });

  it('should reset timeout reference after timeout completes', () => {
    const { result } = renderHook(() => useShakeAnimation());

    act(() => {
      result.current.triggerShake();
    });

    act(() => {
      vi.advanceTimersByTime(320);
    });

    // Trigger again to ensure no interference from previous timeout
    act(() => {
      result.current.triggerShake();
    });

    expect(result.current.shouldShake).toBe(true);
  });
});
