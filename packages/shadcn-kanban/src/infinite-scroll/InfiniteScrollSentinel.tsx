'use client';

import type { InfiniteScrollSentinelProps } from './types';

import { cn } from '@pixpilot/shadcn-ui';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useIntersectionObserver } from './use-intersection-observer';

function DefaultLoading() {
  return (
    <span className="text-muted-foreground flex items-center gap-2 text-xs">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Loading…
    </span>
  );
}

/**
 * An invisible element placed after the last item of a scrollable list. When it
 * scrolls into view it asks the parent for the next page.
 *
 * ```
 * ┌─────────────────┐
 * │ list item 1     │
 * │ …               │
 * │ list item N     │
 * │ [sentinel]  ◄───┼── observed
 * └─────────────────┘
 * ```
 *
 * The parent stays in control of the data: this only reports *when* to load.
 */
export function InfiniteScrollSentinel({
  onLoadMore,
  hasMore = true,
  isLoading = false,
  loadingComponent,
  endMessage,
  className,
  distance,
  root,
  threshold,
  disabled = false,
}: InfiniteScrollSentinelProps) {
  /* Standing down while loading is also what re-arms the observer: the effect
     re-runs when this flips back to `false`, emitting a fresh entry even if the
     sentinel never left the viewport. */
  const idle = disabled || !hasMore || isLoading;

  const ref = useIntersectionObserver({
    onIntersect: onLoadMore,
    distance,
    root,
    threshold,
    disabled: idle,
  });

  return (
    <div
      ref={ref}
      data-slot="infinite-scroll-sentinel"
      aria-hidden={!isLoading}
      className={cn('flex shrink-0 items-center justify-center py-2', className)}
    >
      {isLoading ? (loadingComponent ?? <DefaultLoading />) : null}
      {!isLoading && !hasMore ? endMessage : null}
    </div>
  );
}
