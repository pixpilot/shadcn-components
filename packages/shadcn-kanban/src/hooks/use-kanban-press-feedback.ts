'use client';

import React from 'react';
import {
  TOUCH_ACTIVATION_DELAY,
  TOUCH_ACTIVATION_TOLERANCE,
} from '../utils/kanban-touch-defaults';

interface UseKanbanPressFeedbackOptions {
  /** Must match the touch sensor's delay, or the ring would lie about timing. */
  delay?: number;
  /** Must match the touch sensor's tolerance, for the same reason. */
  tolerance?: number;
  /** Skips the listeners entirely when the card cannot be dragged anyway. */
  disabled?: boolean;
}

export interface UseKanbanPressFeedbackResult {
  /** `true` from the moment a finger lands until the press resolves. */
  isPressing: boolean;
  /** Attach to the card. Touch-only: a mouse never reaches these. */
  handlers: {
    onTouchStart: React.TouchEventHandler;
    onTouchMove: React.TouchEventHandler;
    onTouchEnd: React.TouchEventHandler;
    onTouchCancel: React.TouchEventHandler;
  };
}

/**
 * Mirrors the touch sensor's activation window so a held card can show that it
 * is being held.
 *
 * dnd-kit only reports a drag once it has already started, which on touch is
 * one delay too late: without feedback the hold feels like nothing is
 * happening, and the user lets go before the drag ever arms. This watches the
 * same touch stream under the same constraints and reports the in-between
 * state, so the card can acknowledge the press while it is still a press.
 *
 * It never drives the drag itself — dnd-kit remains the only thing that decides
 * whether a gesture becomes one. The worst a desync can do is show or hide a
 * ring.
 */
export function useKanbanPressFeedback({
  delay = TOUCH_ACTIVATION_DELAY,
  tolerance = TOUCH_ACTIVATION_TOLERANCE,
  disabled = false,
}: UseKanbanPressFeedbackOptions = {}): UseKanbanPressFeedbackResult {
  const [isPressing, setIsPressing] = React.useState(false);
  const originRef = React.useRef<{ x: number; y: number } | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    originRef.current = null;
    setIsPressing(false);
  }, []);

  /* A card can unmount mid-press — virtualization alone guarantees it. */
  React.useEffect(() => clear, [clear]);

  const handlers = React.useMemo(
    () => ({
      onTouchStart: (event: React.TouchEvent) => {
        const touch = event.touches[0];
        /* A second finger is a pinch, not a press. */
        if (disabled || !touch || event.touches.length > 1) return;

        originRef.current = { x: touch.clientX, y: touch.clientY };
        setIsPressing(true);
        /* Drop the ring the instant the drag takes over, so the two states
           never overlap and the card does not look doubly active. */
        timeoutRef.current = setTimeout(() => setIsPressing(false), delay);
      },
      onTouchMove: (event: React.TouchEvent) => {
        const origin = originRef.current;
        const touch = event.touches[0];
        if (!origin || !touch) return;

        const moved =
          Math.abs(touch.clientX - origin.x) > tolerance ||
          Math.abs(touch.clientY - origin.y) > tolerance;
        /* Past the tolerance the sensor has given the gesture back to the
           browser as a scroll, so the card must stop claiming it. */
        if (moved) clear();
      },
      onTouchEnd: clear,
      onTouchCancel: clear,
    }),
    [clear, delay, tolerance, disabled],
  );

  return { isPressing, handlers };
}
