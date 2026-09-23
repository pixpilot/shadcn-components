import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import type {
  KanbanChangeEvent,
  KanbanColumn,
  KanbanItem,
  KanbanTouchOptions,
} from '../../src';

import { renderHook } from '@testing-library/react';
import { useKanbanDrag } from '../../src/hooks/use-kanban-drag';

export const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'empty', title: 'Empty' },
];

export const ITEMS: KanbanItem[] = [
  { id: 'todo-1', name: 'Todo 1', columnId: 'todo' },
  { id: 'todo-2', name: 'Todo 2', columnId: 'todo' },
  { id: 'doing-1', name: 'Doing 1', columnId: 'doing' },
];

/** Height used for every fixture rect, so `insertAfter` maths stays readable. */
const ROW_HEIGHT = 50;

export interface DragProps {
  externalItems: KanbanItem[];
  columns: KanbanColumn[];
  onChange?: (event: KanbanChangeEvent) => void;
  onColumnChange?: (columns: KanbanColumn[]) => void;
  touch?: KanbanTouchOptions;
}

export function setupDrag(props: DragProps) {
  return renderHook(
    (current: DragProps) => useKanbanDrag<Record<string, unknown>>(current),
    { initialProps: props },
  );
}

export function startEvent(activeId: string): DragStartEvent {
  return { active: { id: activeId } } as unknown as DragStartEvent;
}

function rect(top: number) {
  return {
    top,
    left: 0,
    width: 200,
    height: ROW_HEIGHT,
    right: 200,
    bottom: top + ROW_HEIGHT,
  };
}

interface DragEventOptions {
  /** Top edge of the dragged card; past `overTop + 50` it lands after the target. */
  activeTop?: number;
  overTop?: number;
}

/**
 * A drag-over/drag-end event carrying the rects the placement maths reads.
 * The two event shapes overlap for everything the hook touches.
 */
export function dragEvent(
  activeId: string,
  overId: string | null,
  { activeTop = 0, overTop = 0 }: DragEventOptions = {},
): DragOverEvent & DragEndEvent {
  return {
    active: { id: activeId, rect: { current: { translated: rect(activeTop) } } },
    over: overId === null ? null : { id: overId, rect: rect(overTop) },
  } as unknown as DragOverEvent & DragEndEvent;
}

/** Ids of the cards in a column, in order. */
export function idsIn(items: KanbanItem[], columnId: string): string[] {
  return items.filter((item) => item.columnId === columnId).map((item) => item.id);
}
