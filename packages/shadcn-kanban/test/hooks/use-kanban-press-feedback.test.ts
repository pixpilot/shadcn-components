import type React from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useKanbanPressFeedback } from '../../src/hooks/use-kanban-press-feedback';

/** Minimal stand-in for the touch event the card actually receives. */
function touchEvent(x: number, y: number, count = 1): React.TouchEvent {
  const touches = Array.from({ length: count }, () => ({ clientX: x, clientY: y }));
  return { touches } as unknown as React.TouchEvent;
}

describe('useKanbanPressFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should mark the card as pressed as soon as a finger lands', () => {
    const { result } = renderHook(() => useKanbanPressFeedback());

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));

    expect(result.current.isPressing).toBe(true);
  });

  it('should hand over to the drag once the hold completes', () => {
    const { result } = renderHook(() => useKanbanPressFeedback({ delay: 250 }));

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));
    act(() => {
      vi.advanceTimersByTime(250);
    });

    /* The drag overlay takes over here; two active states would read as a bug. */
    expect(result.current.isPressing).toBe(false);
  });

  it('should keep the press through movement inside the tolerance', () => {
    const { result } = renderHook(() => useKanbanPressFeedback({ tolerance: 8 }));

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));
    act(() => result.current.handlers.onTouchMove(touchEvent(15, 12)));

    expect(result.current.isPressing).toBe(true);
  });

  it('should give the gesture back to the browser once it becomes a scroll', () => {
    const { result } = renderHook(() => useKanbanPressFeedback({ tolerance: 8 }));

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));
    act(() => result.current.handlers.onTouchMove(touchEvent(10, 60)));

    expect(result.current.isPressing).toBe(false);
  });

  it('should not re-arm after the tolerance was exceeded', () => {
    const { result } = renderHook(() => useKanbanPressFeedback({ delay: 250 }));

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));
    act(() => result.current.handlers.onTouchMove(touchEvent(10, 90)));
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current.isPressing).toBe(false);
  });

  it('should clear the press when the finger lifts', () => {
    const { result } = renderHook(() => useKanbanPressFeedback());

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));
    act(() => result.current.handlers.onTouchEnd(touchEvent(10, 10)));

    expect(result.current.isPressing).toBe(false);
  });

  it('should clear the press when the browser cancels the touch', () => {
    const { result } = renderHook(() => useKanbanPressFeedback());

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));
    act(() => result.current.handlers.onTouchCancel(touchEvent(10, 10)));

    expect(result.current.isPressing).toBe(false);
  });

  it('should ignore a second finger, which is a pinch rather than a press', () => {
    const { result } = renderHook(() => useKanbanPressFeedback());

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10, 2)));

    expect(result.current.isPressing).toBe(false);
  });

  it('should stay inert when the card cannot be dragged', () => {
    const { result } = renderHook(() => useKanbanPressFeedback({ disabled: true }));

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));

    expect(result.current.isPressing).toBe(false);
  });

  it('should drop its timer when the card unmounts mid-press', () => {
    const { result, unmount } = renderHook(() => useKanbanPressFeedback());

    act(() => result.current.handlers.onTouchStart(touchEvent(10, 10)));
    unmount();

    /* A surviving timer would set state on an unmounted card. */
    expect(() => vi.runAllTimers()).not.toThrow();
  });
});
