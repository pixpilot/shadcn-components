import type { UniqueIdentifier } from '@dnd-kit/core';
import type { KanbanItem } from '../types';

import { arrayMove } from '@dnd-kit/sortable';
import { moveKanbanItem } from './move-kanban-item';

interface ApplyKanbanDropOptions<T> {
  /** Items as they stand at drop time, including any live drag-over preview. */
  items: KanbanItem<T>[];
  activeId: UniqueIdentifier;
  overId: UniqueIdentifier;
  /** Column the drop target belongs to, or `undefined` if unresolvable. */
  overColumnId: string | undefined;
  insertAfter: boolean;
  overIsColumn: boolean;
}

/**
 * Produces the final item list for a completed drop.
 *
 * Drops inside the card's current column commit the reorder that the sortable
 * transforms have been previewing. Drops onto another column are applied here
 * because `onDragOver` never previewed them — keyboard drags and drops onto an
 * empty column both land in this branch. Anything else leaves the list as-is.
 */
export function applyKanbanDrop<T>({
  items,
  activeId,
  overId,
  overColumnId,
  insertAfter,
  overIsColumn,
}: ApplyKanbanDropOptions<T>): KanbanItem<T>[] {
  const activeItem = items.find((item) => item.id === activeId);
  if (!activeItem) return items;

  const activeColumnId = activeItem.columnId;
  const overItem = items.find((item) => item.id === overId);

  if (overItem !== undefined && overItem.columnId === activeColumnId) {
    const activeIndex = items.indexOf(activeItem);
    const overIndex = items.indexOf(overItem);
    return activeIndex === overIndex ? items : arrayMove(items, activeIndex, overIndex);
  }

  if (overColumnId !== undefined && overColumnId !== activeColumnId) {
    return moveKanbanItem({
      items,
      activeId,
      overId,
      targetColumnId: overColumnId,
      insertAfter,
      overIsColumn,
    });
  }

  return items;
}
