import type { KanbanColumn, KanbanItem } from '../src';

import { act, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KanbanBoard } from '../src';

/* Captures the board's drag callbacks so a test can start a drag by hand. */
const dnd = vi.hoisted(() => ({
  onDragStart: null as ((event: { active: { id: string } }) => void) | null,
}));

/* Real dragging needs layout jsdom cannot provide, so dnd-kit is stubbed out. */
vi.mock('@dnd-kit/core', () => {
  const mockDroppable = () => ({ setNodeRef: () => undefined, isOver: false });
  return {
    DndContext: (props: {
      children: React.ReactNode;
      onDragStart: (event: { active: { id: string } }) => void;
    }) => {
      dnd.onDragStart = props.onDragStart;
      return <div>{props.children}</div>;
    },
    DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useDroppable: mockDroppable,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
    closestCorners: vi.fn(),
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
  };
});

vi.mock('@dnd-kit/sortable', () => {
  const mockSortable = () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => undefined,
    transform: null,
    transition: undefined,
    isDragging: false,
  });
  return {
    SortableContext: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useSortable: mockSortable,
    arrayMove: <T,>(arr: T[]) => arr,
    horizontalListSortingStrategy: vi.fn(),
    verticalListSortingStrategy: vi.fn(),
    sortableKeyboardCoordinates: vi.fn(),
  };
});

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

const COLUMNS: KanbanColumn[] = [{ id: 'todo', title: 'To Do' }];

const ITEM_COUNT = 200;
const ITEMS: KanbanItem[] = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  id: `card-${i + 1}`,
  name: `Card ${i + 1}`,
  columnId: 'todo',
}));

const CARDS = '[data-testid^="kanban-item-"]';
const SPACER = '[data-testid="kanban-column-virtual-todo"]';

const ESTIMATED_ITEM_HEIGHT = 40;
const GAP = 10;

const SCROLLER_HEIGHT = 300;
const MEASURED_ITEM_HEIGHT = 40;

/**
 * jsdom lays nothing out, and the virtualizer refuses to pick a range while the
 * scroller measures zero. Give it just enough geometry to have an opinion: a
 * scroller tall enough to hold a handful of cards, and cards with a height.
 */
function stubLayout() {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(SCROLLER_HEIGHT);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    height: MEASURED_ITEM_HEIGHT,
    width: 250,
  } as DOMRect);
}

describe('kanbanBoard virtualization', () => {
  it('mounts only a window of a long column instead of every card', () => {
    stubLayout();

    const { container } = render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        virtualization={{}}
      />,
    );

    const mounted = container.querySelectorAll(CARDS);
    expect(mounted.length).toBeGreaterThan(0);
    expect(mounted.length).toBeLessThan(ITEM_COUNT);
  });

  it('keeps the dragged card mounted once it leaves the window', () => {
    stubLayout();

    const { container } = render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        virtualization={{}}
      />,
    );

    /* The last card sits far outside a window anchored at the top of the list. */
    const lastId = ITEMS.at(-1)!.id;
    const lastCard = `[data-testid="kanban-item-${lastId}"]`;
    expect(container.querySelector(lastCard)).toBeNull();

    /* Picking it up pins it into the range, wherever the column has scrolled to. */
    act(() => dnd.onDragStart?.({ active: { id: lastId } }));

    expect(container.querySelector(lastCard)).not.toBeNull();
  });

  it('sizes the spacer for the whole column so the scrollbar stays honest', () => {
    const { container } = render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        virtualization={{ estimateItemHeight: ESTIMATED_ITEM_HEIGHT, gap: GAP }}
      />,
    );

    /* Every card is estimated, with a gap between each neighbouring pair. */
    const expected = ITEM_COUNT * ESTIMATED_ITEM_HEIGHT + (ITEM_COUNT - 1) * GAP;
    expect(container.querySelector<HTMLElement>(SPACER)?.style.height).toBe(
      `${expected}px`,
    );
  });

  it('mounts every card when virtualization is omitted', () => {
    const { container } = render(
      <KanbanBoard columns={COLUMNS} items={ITEMS} columnOverflow="scroll" />,
    );

    expect(container.querySelectorAll(CARDS)).toHaveLength(ITEM_COUNT);
    expect(container.querySelector(SPACER)).toBeNull();
  });

  it('mounts every card while virtualization is disabled', () => {
    const { container } = render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        virtualization={{ disabled: true }}
      />,
    );

    expect(container.querySelectorAll(CARDS)).toHaveLength(ITEM_COUNT);
    expect(container.querySelector(SPACER)).toBeNull();
  });

  it('logs a development error and mounts every card for columnOverflow="expand"', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { container } = render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="expand"
        virtualization={{}}
      />,
    );

    expect(container.querySelectorAll(CARDS)).toHaveLength(ITEM_COUNT);
    expect(container.querySelector(SPACER)).toBeNull();
    expect(error).toHaveBeenCalledOnce();
    expect(error.mock.calls[0]?.[0]).toContain(
      '`virtualization` is not implemented for columnOverflow',
    );
  });
});
