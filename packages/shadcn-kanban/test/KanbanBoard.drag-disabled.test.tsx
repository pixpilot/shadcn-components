import type { KanbanColumn, KanbanItem } from '../src';

import { render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KanbanBoard } from '../src';

/* Every `useSortable` registration, so a test can read back what was disabled. */
const sortableCalls = vi.hoisted(
  () => [] as { id: string; disabled: boolean | undefined }[],
);

/* Real dragging needs layout jsdom cannot provide, so dnd-kit is stubbed out. */
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DragOverlay: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  useDroppable: () => ({ setNodeRef: () => undefined, isOver: false }),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  closestCenter: vi.fn(() => []),
  pointerWithin: vi.fn(() => []),
  rectIntersection: vi.fn(() => []),
  getFirstCollision: vi.fn(() => null),
  KeyboardCode: {
    Down: 'ArrowDown',
    Up: 'ArrowUp',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
  },
  MeasuringStrategy: { Always: 'always' },
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  useSortable: ({ id, disabled }: { id: string; disabled?: boolean }) => {
    sortableCalls.push({ id, disabled });
    return {
      attributes: {},
      listeners: {},
      setNodeRef: () => undefined,
      transform: null,
      transition: undefined,
      isDragging: false,
    };
  },
  arrayMove: <T,>(arr: T[]) => arr,
  horizontalListSortingStrategy: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
  sortableKeyboardCoordinates: vi.fn(),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'done', title: 'Done' },
];

const ITEMS: KanbanItem[] = [
  { id: 'a', name: 'A', columnId: 'todo' },
  { id: 'b', name: 'B', columnId: 'done' },
];

/** The registration for a card, ignoring the column sortables sharing the tree. */
function cardRegistration(id: string) {
  return sortableCalls.find((call) => call.id === id);
}

afterEach(() => {
  sortableCalls.length = 0;
  vi.clearAllMocks();
});

describe('kanbanBoard dragDisabled', () => {
  it('leaves cards draggable by default', () => {
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

    expect(cardRegistration('a')?.disabled).toBe(false);
    expect(cardRegistration('b')?.disabled).toBe(false);
  });

  it('disables every card sortable while dragDisabled', () => {
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} dragDisabled />);

    expect(cardRegistration('a')?.disabled).toBe(true);
    expect(cardRegistration('b')?.disabled).toBe(true);
  });

  it('keeps cards rendered and clickable while dragDisabled', () => {
    const onClick = vi.fn();
    render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        dragDisabled
        renderItem={(item) => (
          <button type="button" onClick={onClick}>
            {item.name}
          </button>
        )}
      />,
    );

    screen.getByRole('button', { name: 'A' }).click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('drops the column drag handle while dragDisabled', () => {
    const { rerender } = render(
      <KanbanBoard columns={COLUMNS} items={ITEMS} onColumnChange={vi.fn()} />,
    );

    /* Column headers only render a grip while the columns are sortable. */
    const handleCount = screen.getAllByRole('button').length;
    expect(handleCount).toBeGreaterThan(0);

    rerender(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        onColumnChange={vi.fn()}
        dragDisabled
      />,
    );

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
