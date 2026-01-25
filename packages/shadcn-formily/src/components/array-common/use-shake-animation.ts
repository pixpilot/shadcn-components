import React from 'react';

const SHAKE_RESET_DELAY_MS = 320;

/**
 * Hook to trigger a shake animation effect
 * Returns state and trigger function for shake animation
 */
export function useShakeAnimation() {
  const [shouldShake, setShouldShake] = React.useState(false);
  const shakeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerShake = React.useCallback(() => {
    if (shakeTimeoutRef.current != null) {
      clearTimeout(shakeTimeoutRef.current);
    }

    setShouldShake(false);

    requestAnimationFrame(() => {
      setShouldShake(true);
      shakeTimeoutRef.current = setTimeout(() => {
        setShouldShake(false);
        shakeTimeoutRef.current = null;
      }, SHAKE_RESET_DELAY_MS);
    });
  }, []);

  React.useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current != null) {
        clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = null;
      }
    };
  }, []);

  return { shouldShake, triggerShake };
}
