'use client';

import type { RefObject } from 'react';
import type { KanbanColumn, KanbanItem } from '../types';

import React from 'react';
import { replaceState } from '../utils/replace-state';

interface UseKanbanBoardStateOptions<T> {
  externalItems: KanbanItem<T>[];
  columns: KanbanColumn[];
  /** Set while a drag is in flight so prop mirroring can stand down. */
  isDragActiveRef: RefObject<boolean>;
}

export interface KanbanBoardState<T> {
  items: KanbanItem<T>[];
  /** Always-current items, readable from drag callbacks without re-subscribing. */
  itemsRef: RefObject<KanbanItem<T>[]>;
  applyItems: (next: KanbanItem<T>[]) => void;
  internalColumns: KanbanColumn[];
  setInternalColumns: (next: KanbanColumn[]) => void;
}

/**
 * Mirrors the controlled `items` and `columns` props into local state so the
 * board can render drag previews the parent has not committed yet.
 */
export function useKanbanBoardState<T>({
  externalItems,
  columns,
  isDragActiveRef,
}: UseKanbanBoardStateOptions<T>): KanbanBoardState<T> {
  const [items, setItems] = React.useReducer(
    replaceState<KanbanItem<T>[]>,
    externalItems,
  );
  const [internalColumns, setInternalColumns] = React.useReducer(
    replaceState<KanbanColumn[]>,
    columns,
  );
  const itemsRef = React.useRef(externalItems);

  const applyItems = React.useCallback((next: KanbanItem<T>[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  /*
   * A parent that rebuilds its items array on every render would otherwise
   * wipe the in-flight preview, so mid-drag prop updates are ignored and
   * picked up by the sync that follows the drop.
   */
  React.useEffect(() => {
    if (isDragActiveRef.current) return;
    applyItems(externalItems);
  }, [externalItems, applyItems, isDragActiveRef]);

  React.useEffect(() => {
    setInternalColumns(columns);
  }, [columns]);

  return { items, itemsRef, applyItems, internalColumns, setInternalColumns };
}
