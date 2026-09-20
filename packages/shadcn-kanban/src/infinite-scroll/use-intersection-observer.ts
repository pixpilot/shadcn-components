'use client';

import type { IntersectionOptions } from './types';

import React from 'react';

const DEFAULT_DISTANCE = 200;

interface UseIntersectionObserverOptions extends IntersectionOptions {
  /** Fired every time the observed node enters the root's expanded box. */
  onIntersect: () => void;
}

/**
 * Observes a single node and calls `onIntersect` whenever it comes into view.
 *
 * Returns a ref callback to attach to the node being watched. The observer is
 * rebuilt whenever `disabled` or any of the geometry options change — which is
 * what lets a caller resume paging: re-observing emits a fresh entry even when
 * the node never actually left the viewport, so a page too short to push the
 * node out of view does not silently stall the sequence.
 */
export function useIntersectionObserver({
  onIntersect,
  distance = DEFAULT_DISTANCE,
  root,
  threshold = 0,
  disabled = false,
}: UseIntersectionObserverOptions): (node: Element | null) => void {
  const [node, setNode] = React.useState<Element | null>(null);

  /* Held in a ref so a caller re-creating the callback each render does not
     tear down and rebuild the observer. */
  const onIntersectRef = React.useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  React.useEffect(() => {
    if (node == null || disabled) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onIntersectRef.current();
      },
      { root: root ?? null, rootMargin: `0px 0px ${distance}px 0px`, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, disabled, root, distance, threshold]);

  return setNode;
}
