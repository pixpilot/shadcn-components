import type { UniqueIdentifier } from '@dnd-kit/core';
import type { KanbanItem } from '../types';

interface MoveKanbanItemOptions<T> {
  items: KanbanItem<T>[];
  activeId: UniqueIdentifier;
  overId: UniqueIdentifier;
  targetColumnId: string;
  insertAfter: boolean;
  overIsColumn: boolean;
}

/**
 * Returns a new item list with one card placed relative to the current drop target.
 * The input is never mutated, so previews and final drops can use the same drag snapshot.
 */
export function moveKanbanItem<T>({
  items,
  activeId,
  overId,
  targetColumnId,
  insertAfter,
  overIsColumn,
}: MoveKanbanItemOptions<T>): KanbanItem<T>[] {
  const activeItem = items.find((item) => item.id === activeId);
  if (!activeItem) return items;

  const next = items.filter((item) => item.id !== activeId);
  const movedItem = { ...activeItem, columnId: targetColumnId };

  if (!overIsColumn) {
    const overIndex = next.findIndex((item) => item.id === overId);
    if (overIndex !== -1) {
      next.splice(overIndex + Number(insertAfter), 0, movedItem);
      return next;
    }
  }

  /* No card to anchor to: land after the target column's last card. */
  const lastIndexInColumn = next.reduce(
    (last, item, index) => (item.columnId === targetColumnId ? index : last),
    -1,
  );
  next.splice(
    lastIndexInColumn === -1 ? next.length : lastIndexInColumn + 1,
    0,
    movedItem,
  );
  return next;
}
