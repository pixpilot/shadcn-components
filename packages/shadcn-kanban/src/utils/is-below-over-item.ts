import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';

/**
 * Whether the dragged card should be inserted *after* the card it is over.
 *
 * The card only counts as "below" once its top edge clears the hovered card's
 * bottom edge, so a card resting on top of another still lands before it.
 */
export function isBelowOverItem(event: DragOverEvent | DragEndEvent): boolean {
  const activeRect = event.active.rect?.current?.translated;
  const overRect = event.over?.rect;
  if (activeRect == null || overRect == null) return false;
  return activeRect.top > overRect.top + overRect.height;
}
