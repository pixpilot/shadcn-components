'use client';

import type { DragEndEvent } from '@dnd-kit/core';
import type { KanbanColumn } from '../types';

import { arrayMove } from '@dnd-kit/sortable';
import React from 'react';
import { extractColumnId, isColumnSortableId } from '../utils/column-sortable-id';

interface UseKanbanColumnReorderOptions {
  internalColumns: KanbanColumn[];
  setInternalColumns: (next: KanbanColumn[]) => void;
  onColumnChange?: (columns: KanbanColumn[]) => void;
}

/** Commits a column drag, ignoring drops that do not land on another column. */
export function useKanbanColumnReorder({
  internalColumns,
  setInternalColumns,
  onColumnChange,
}: UseKanbanColumnReorderOptions): (event: DragEndEvent) => void {
  return React.useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || !isColumnSortableId(over.id) || active.id === over.id) return;

      const indexOf = (sortableId: DragEndEvent['active']['id']): number =>
        internalColumns.findIndex((column) => column.id === extractColumnId(sortableId));

      const oldIndex = indexOf(active.id);
      const newIndex = indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const next = arrayMove(internalColumns, oldIndex, newIndex);
      setInternalColumns(next);
      onColumnChange?.(next);
    },
    [internalColumns, onColumnChange, setInternalColumns],
  );
}
