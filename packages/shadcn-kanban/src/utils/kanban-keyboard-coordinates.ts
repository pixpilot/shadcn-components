import type {
  ClientRect,
  DroppableContainer,
  KeyboardCoordinateGetter,
} from '@dnd-kit/core';

import { closestCenter, getFirstCollision, KeyboardCode } from '@dnd-kit/core';

interface DroppableData {
  type?: string;
  item?: { columnId?: string };
}

interface Candidate {
  container: DroppableContainer;
  rect: ClientRect;
}

/** Which candidates an arrow key may move onto, relative to the dragged rect. */
const DIRECTION_FILTERS: Record<
  string,
  (collisionRect: ClientRect, rect: ClientRect) => boolean
> = {
  [KeyboardCode.Down]: (collisionRect, rect) => collisionRect.top < rect.top,
  [KeyboardCode.Up]: (collisionRect, rect) => collisionRect.top > rect.top,
  [KeyboardCode.Left]: (collisionRect, rect) => collisionRect.left > rect.left,
  [KeyboardCode.Right]: (collisionRect, rect) => collisionRect.left < rect.left,
};

/**
 * Keyboard coordinate getter for the Kanban board, adapted from dnd-kit's
 * multiple-containers example.
 *
 * The stock `sortableKeyboardCoordinates` also targets the dragged card's own
 * column drop zone, whose left edge sits just beside the card, so arrow keys
 * could never leave the column. Here cards target other cards and empty
 * columns only, and column drags target other columns.
 */
export const kanbanKeyboardCoordinates: KeyboardCoordinateGetter = (
  event,
  { context },
) => {
  const matchesDirection = DIRECTION_FILTERS[event.code];
  if (!matchesDirection) return undefined;

  event.preventDefault();

  const { active, collisionRect, droppableRects, droppableContainers } = context;
  if (!active || !collisionRect) return undefined;

  const draggingColumn =
    (active.data.current as DroppableData | undefined)?.type === 'column-sortable';
  /* `getEnabled` already drops disabled containers, so none are filtered here. */
  const enabled = droppableContainers.getEnabled();

  /* The dragged card counts too: its own column must never be an arrow target. */
  const columnHasCards = (columnId: string): boolean =>
    enabled.some((entry) => {
      const data = entry.data.current as DroppableData | undefined;
      return data?.type === 'item' && data.item?.columnId === columnId;
    });

  const isCandidate = (entry: DroppableContainer): boolean => {
    if (entry.id === active.id) return false;

    const type = (entry.data.current as DroppableData | undefined)?.type;
    if (draggingColumn) return type === 'column-sortable';
    if (type === 'column-sortable') return false;
    /* Skip populated column drop zones so arrows land on their cards instead. */
    return !(type === 'column' && columnHasCards(String(entry.id)));
  };

  const candidates = enabled.reduce<Candidate[]>((accumulator, container) => {
    const rect = droppableRects.get(container.id);
    if (rect && isCandidate(container) && matchesDirection(collisionRect, rect)) {
      accumulator.push({ container, rect });
    }
    return accumulator;
  }, []);

  const closestId = getFirstCollision(
    closestCenter({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: candidates.map(({ container }) => container),
      pointerCoordinates: null,
    }),
    'id',
  );

  const winner = candidates.find(({ container }) => container.id === closestId);
  return winner ? { x: winner.rect.left, y: winner.rect.top } : undefined;
};
