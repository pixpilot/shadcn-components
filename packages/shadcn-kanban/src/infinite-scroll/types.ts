import type { ReactNode } from 'react';

/** Tuning knobs shared by the observer hook and the sentinel component. */
export interface IntersectionOptions {
  /**
   * How many pixels before the sentinel actually reaches the scroll edge the
   * callback should fire. Larger values load earlier and hide the wait.
   *
   * @default 200
   */
  distance?: number;
  /**
   * The scrollable ancestor to measure against. Pass the element that owns the
   * overflow; defaults to the browser viewport.
   */
  root?: Element | null;
  /**
   * Fraction of the sentinel that must be visible before it counts as
   * intersecting.
   *
   * @default 0
   */
  threshold?: number;
  /** Stops observing entirely while `true`. */
  disabled?: boolean;
}

/** Props for `<InfiniteScrollSentinel />`. */
export interface InfiniteScrollSentinelProps extends IntersectionOptions {
  /** Called when the sentinel scrolls into view and more data is available. */
  onLoadMore: () => void;
  /**
   * Whether another page can be loaded. Once `false` the sentinel stops firing
   * and renders {@link endMessage} instead.
   *
   * @default true
   */
  hasMore?: boolean;
  /** Suppresses further calls while a load is in flight. */
  isLoading?: boolean;
  /** Rendered while {@link isLoading}. Defaults to a small spinner. */
  loadingComponent?: ReactNode;
  /** Rendered once {@link hasMore} is `false`. Nothing is shown by default. */
  endMessage?: ReactNode;
  /** Extra className for the sentinel wrapper. */
  className?: string;
}
