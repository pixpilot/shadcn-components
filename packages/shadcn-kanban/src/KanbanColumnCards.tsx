'use client';

import type React from 'react';
import type {
  KanbanColumn as KanbanColumnType,
  KanbanItem as KanbanItemType,
  KanbanTouchOptions,
} from './types';

import { KanbanItem } from './KanbanItem';

/** Shared by the plain and the virtualized card lists. */
export interface KanbanColumnCardsProps<T> {
  column: KanbanColumnType;
  /** Every card of this column, already filtered — not just the visible ones. */
  items: KanbanItemType<T>[];
  renderItem?: (item: KanbanItemType<T>, column: KanbanColumnType) => React.ReactNode;
  itemClassName?: string;
  /** Freezes dragging of every card in the list. */
  dragDisabled?: boolean;
  /** Hold-to-drag tuning, forwarded to every card. */
  touch?: KanbanTouchOptions;
}

/**
 * The card list of a column, rendered in full. Each card is a flex child of
 * the column's scroller, so spacing comes from the scroller's `gap`.
 */
export function KanbanColumnCards<T = Record<string, unknown>>({
  column,
  items,
  renderItem,
  itemClassName,
  dragDisabled = false,
  touch,
}: KanbanColumnCardsProps<T>) {
  return items.map((item) => (
    <KanbanItem
      key={item.id}
      item={item}
      column={column}
      renderItem={renderItem}
      className={itemClassName}
      dragDisabled={dragDisabled}
      touch={touch}
    />
  ));
}
