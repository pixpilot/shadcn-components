import type { UniqueIdentifier } from '@dnd-kit/core';
import type { KanbanItem } from '../types';

import { extractColumnId, isColumnSortableId } from './column-sortable-id';

/** Whether an id addresses a column as a whole rather than a single card. */
export function isColumnDroppableId(
  id: UniqueIdentifier,
  columnIds: ReadonlySet<string>,
): boolean {
  return columnIds.has(String(id)) || isColumnSortableId(id);
}

/**
 * Resolves any droppable id — a card, a column drop zone, or a column-sortable
 * handle — to the column it belongs to. Returns `undefined` for ids that match
 * nothing on the board (e.g. a card that was removed mid-drag).
 */
export function resolveColumnId<T>(
  id: UniqueIdentifier,
  columnIds: ReadonlySet<string>,
  items: readonly KanbanItem<T>[],
): string | undefined {
  const key = String(id);
  if (columnIds.has(key)) return key;

  if (isColumnSortableId(id)) {
    const columnId = extractColumnId(id);
    return columnIds.has(columnId) ? columnId : undefined;
  }

  return items.find((item) => item.id === id)?.columnId;
}
