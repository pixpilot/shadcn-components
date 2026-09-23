'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Range } from '@tanstack/react-virtual';
import type { KanbanColumnCardsProps } from './KanbanColumnCards';
import type { KanbanVirtualization } from './types';

import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import { KanbanItem } from './KanbanItem';

const DEFAULT_ESTIMATED_ITEM_HEIGHT = 96;
const DEFAULT_OVERSCAN = 6;
/** Matches the `gap-2` the non-virtualized list gets from the scroller. */
const DEFAULT_GAP = 8;

export interface KanbanVirtualColumnCardsProps<T> extends KanbanColumnCardsProps<T> {
  /** This column's own scroller; `null` until the ref lands. */
  scroller: HTMLElement | null;
  /** The card currently being dragged, board-wide. */
  activeItemId: UniqueIdentifier | null;
  options: KanbanVirtualization;
}

/**
 * The card list of a column, virtualized: only the cards near the scroller's
 * window are mounted, positioned absolutely inside a spacer tall enough to
 * keep the scrollbar honest.
 *
 * Each card keeps its own wrapper so the two transforms never collide — the
 * wrapper carries the virtual offset, the card inside carries whatever
 * dnd-kit's sortable is animating.
 */
export function KanbanVirtualColumnCards<T = Record<string, unknown>>({
  column,
  items,
  renderItem,
  itemClassName,
  scroller,
  activeItemId,
  options,
  dragDisabled = false,
  touch,
}: KanbanVirtualColumnCardsProps<T>) {
  const {
    estimateItemHeight = DEFAULT_ESTIMATED_ITEM_HEIGHT,
    overscan = DEFAULT_OVERSCAN,
    gap = DEFAULT_GAP,
  } = options;

  const activeIndex = React.useMemo(
    () =>
      activeItemId == null
        ? -1
        : items.findIndex((item) => item.id === String(activeItemId)),
    [items, activeItemId],
  );

  /*
   * dnd-kit holds on to the dragged card's DOM node for the whole gesture, and
   * a keyboard drag or an auto-scroll can carry that card well past the window.
   * Pinning its index into the range keeps it mounted so the drag survives.
   */
  const rangeExtractor = React.useCallback(
    (range: Range) => {
      const indexes = defaultRangeExtractor(range);
      if (activeIndex < 0 || indexes.includes(activeIndex)) return indexes;
      return [...indexes, activeIndex].sort((a, b) => a - b);
    },
    [activeIndex],
  );

  /* Keyed by card id so measured heights survive a reorder. */
  const getItemKey = React.useCallback(
    (index: number) => items[index]?.id ?? index,
    [items],
  );

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scroller,
    estimateSize: () => estimateItemHeight,
    getItemKey,
    rangeExtractor,
    overscan,
    gap,
  });

  return (
    <div
      data-testid={`kanban-column-virtual-${column.id}`}
      className="relative w-full shrink-0"
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((virtualItem) => {
        const item = items[virtualItem.index];
        if (!item) return null;

        return (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            className="absolute top-0 left-0 w-full"
            style={{ transform: `translateY(${virtualItem.start}px)` }}
          >
            <KanbanItem
              item={item}
              column={column}
              renderItem={renderItem}
              className={itemClassName}
              dragDisabled={dragDisabled}
              touch={touch}
            />
          </div>
        );
      })}
    </div>
  );
}
