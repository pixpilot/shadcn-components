import type { CSSProperties } from 'react';
import type { KanbanColumnSnapAlign, KanbanColumnSnapOptions } from '../types';

/** Custom property the column reads its snapped width from. */
export const COLUMN_SNAP_WIDTH_VAR = '--kanban-column-snap-width';

const DEFAULT_COLUMN_WIDTH = '85%';
const DEFAULT_ALIGN: KanbanColumnSnapAlign = 'start';

/*
 * Every class below is spelled out rather than built from the constants above.
 * Tailwind reads the source as text, so a class it cannot see literally is a
 * class it never emits.
 */
const BOARD_SNAP_CLASS =
  /* `scroll-px-2` matches the board's own padding so a snapped column lands
     flush with the edge rather than tucked under it. */
  'max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-2 scroll-smooth';

const COLUMN_SNAP_CLASS =
  /* `snap-always` is what makes this a slider rather than a scroller: a flick
     cannot skip a column, it stops at the next one. */
  'max-sm:w-[var(--kanban-column-snap-width)] max-sm:min-w-0 max-sm:flex-none max-sm:snap-always';

const ALIGN_CLASS: Record<KanbanColumnSnapAlign, string> = {
  start: 'max-sm:snap-start',
  center: 'max-sm:snap-center',
};

export interface ResolvedColumnSnap {
  enabled: boolean;
  /** Classes for the board's scroll container. */
  boardClassName: string;
  /** Classes for each column. */
  columnClassName: string;
  /** Style holding {@link COLUMN_SNAP_WIDTH_VAR}, applied to the board. */
  style?: CSSProperties;
}

const DISABLED: ResolvedColumnSnap = {
  enabled: false,
  boardClassName: '',
  columnClassName: '',
};

/**
 * Turns the `columnSnap` prop into the classes that make the board swipe one
 * column at a time below the `sm` breakpoint.
 *
 * Everything here is CSS scroll snapping, which buys the platform's own
 * momentum, rubber-banding and settle animation for free — and, unlike a JS
 * carousel, keeps working while the main thread is busy re-measuring droppables
 * mid-drag.
 *
 * @param columnSnap - The board's `columnSnap` prop.
 * @param isDragging - Suspends snapping for the length of a drag: dnd-kit
 * auto-scrolls the board by writing `scrollLeft`, and mandatory snap points
 * would pull every one of those writes back to the nearest column.
 */
export function resolveColumnSnap(
  columnSnap: boolean | KanbanColumnSnapOptions | undefined,
  isDragging: boolean,
): ResolvedColumnSnap {
  if (columnSnap === false) return DISABLED;

  const options: KanbanColumnSnapOptions = columnSnap === true ? {} : (columnSnap ?? {});
  const { align = DEFAULT_ALIGN, columnWidth = DEFAULT_COLUMN_WIDTH } = options;

  return {
    enabled: true,
    boardClassName: isDragging ? 'snap-none' : BOARD_SNAP_CLASS,
    columnClassName: `${COLUMN_SNAP_CLASS} ${ALIGN_CLASS[align]}`,
    style: { [COLUMN_SNAP_WIDTH_VAR]: columnWidth } as CSSProperties,
  };
}
