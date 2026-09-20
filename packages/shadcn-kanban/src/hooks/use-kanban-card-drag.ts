'use client';

import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import type { RefObject } from 'react';
import type { KanbanChangeEvent, KanbanItem } from '../types';

import React from 'react';
import { applyKanbanDrop } from '../utils/apply-kanban-drop';
import { isColumnSortableId } from '../utils/column-sortable-id';
import { isBelowOverItem } from '../utils/is-below-over-item';
import { itemsOrderEqual } from '../utils/items-order-equal';
import { moveKanbanItem } from '../utils/move-kanban-item';
import { isColumnDroppableId, resolveColumnId } from '../utils/resolve-column-id';

interface UseKanbanCardDragOptions<T> {
  columnIds: ReadonlySet<string>;
  itemsRef: RefObject<KanbanItem<T>[]>;
  applyItems: (next: KanbanItem<T>[]) => void;
  /** Snapshot taken when the drag began, used to restore and to report from. */
  dragStartItemsRef: RefObject<KanbanItem<T>[]>;
  recentlyMovedToNewColumnRef: RefObject<boolean>;
  onChange?: (event: KanbanChangeEvent<T>) => void;
}

export interface KanbanCardDragHandlers {
  handleCardDragOver: (event: DragOverEvent) => void;
  handleCardDragEnd: (event: DragEndEvent) => void;
}

/**
 * The card half of the board's drag state machine: cross-column moves are
 * previewed live during `onDragOver`, while same-column reordering is left to
 * the sortable transforms and committed once on `onDragEnd`.
 */
export function useKanbanCardDrag<T>(
  options: UseKanbanCardDragOptions<T>,
): KanbanCardDragHandlers {
  const {
    columnIds,
    itemsRef,
    applyItems,
    dragStartItemsRef,
    recentlyMovedToNewColumnRef,
    onChange,
  } = options;

  const handleCardDragOver = React.useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || isColumnSortableId(active.id)) return;

      const overColumnId = resolveColumnId(over.id, columnIds, itemsRef.current);
      const activeItem = itemsRef.current.find((item) => item.id === active.id);
      if (overColumnId === undefined || !activeItem) return;
      /* Same-column hovers are dnd-kit's job; previewing them would fight it. */
      if (activeItem.columnId === overColumnId) return;

      recentlyMovedToNewColumnRef.current = true;
      applyItems(
        moveKanbanItem({
          items: itemsRef.current,
          activeId: active.id,
          overId: over.id,
          targetColumnId: overColumnId,
          insertAfter: isBelowOverItem(event),
          overIsColumn: isColumnDroppableId(over.id, columnIds),
        }),
      );
    },
    [applyItems, columnIds, itemsRef, recentlyMovedToNewColumnRef],
  );

  const handleCardDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const dragStartItems = dragStartItemsRef.current;

      if (!over) {
        applyItems(dragStartItems);
        return;
      }

      const previousColumnId = dragStartItems.find(
        (item) => item.id === active.id,
      )?.columnId;
      if (previousColumnId === undefined) return;

      const next = applyKanbanDrop({
        items: itemsRef.current,
        activeId: active.id,
        overId: over.id,
        overColumnId: resolveColumnId(over.id, columnIds, itemsRef.current),
        insertAfter: isBelowOverItem(event),
        overIsColumn: isColumnDroppableId(over.id, columnIds),
      });
      applyItems(next);

      if (!onChange || itemsOrderEqual(next, dragStartItems)) return;
      const movedItem = next.find((item) => item.id === active.id);
      if (!movedItem) return;

      onChange({
        item: movedItem,
        previousColumnId,
        nextColumnId: movedItem.columnId,
        items: next,
      });
    },
    [applyItems, columnIds, dragStartItemsRef, itemsRef, onChange],
  );

  return { handleCardDragOver, handleCardDragEnd };
}
