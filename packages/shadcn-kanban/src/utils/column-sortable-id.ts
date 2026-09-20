import type { UniqueIdentifier } from '@dnd-kit/core';

/**
 * Columns participate in two dnd-kit registries at once: a droppable using the
 * raw column id (items dropped into the column) and a sortable using a
 * prefixed id (columns reordered against each other). These helpers convert
 * between the two id spaces.
 */
const COLUMN_SORTABLE_PREFIX = 'column-';

export function toColumnSortableId(columnId: string): string {
  return `${COLUMN_SORTABLE_PREFIX}${columnId}`;
}

export function isColumnSortableId(id: UniqueIdentifier): boolean {
  return String(id).startsWith(COLUMN_SORTABLE_PREFIX);
}

export function extractColumnId(sortableId: UniqueIdentifier): string {
  return String(sortableId).slice(COLUMN_SORTABLE_PREFIX.length);
}
