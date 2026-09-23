import type { KanbanColumn, KanbanItem } from '../src';

import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KanbanBoard } from '../src';

/* Drag-and-drop is irrelevant to paging, so stub it out. */
vi.mock('@dnd-kit/core', () => {
  const mockDroppable = () => ({ setNodeRef: () => undefined, isOver: false });
  return {
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useDroppable: mockDroppable,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    MouseSensor: vi.fn(),
    TouchSensor: vi.fn(),
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

/* jsdom has no IntersectionObserver — stub one the test can drive. */
const callbacks: IntersectionObserverCallback[] = [];

function intersectAll() {
  act(() => {
    for (const callback of callbacks) {
      callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }
  });
}

beforeEach(() => {
  callbacks.length = 0;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(public callback: IntersectionObserverCallback) {
        callbacks.push(callback);
      }

      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords() {
        return [];
      }
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'done', title: 'Done' },
];

const ITEMS: KanbanItem[] = [
  { id: '1', name: 'First', columnId: 'todo' },
  { id: '2', name: 'Second', columnId: 'done' },
];

const SENTINEL = '[data-slot="infinite-scroll-sentinel"]';

describe('kanbanBoard infinite scroll', () => {
  it('renders a sentinel in every column when scrolling is enabled', () => {
    const { container } = render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        infiniteScroll={{ onLoadMore: vi.fn(), hasMore: () => true }}
      />,
    );

    expect(container.querySelectorAll(SENTINEL)).toHaveLength(COLUMNS.length);
  });

  it('renders no sentinel when infiniteScroll is omitted', () => {
    const { container } = render(
      <KanbanBoard columns={COLUMNS} items={ITEMS} columnOverflow="scroll" />,
    );

    expect(container.querySelectorAll(SENTINEL)).toHaveLength(0);
  });

  it('passes the intersecting column to onLoadMore', () => {
    const onLoadMore = vi.fn();
    render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        infiniteScroll={{ onLoadMore, hasMore: () => true }}
      />,
    );

    intersectAll();

    expect(onLoadMore).toHaveBeenCalledTimes(COLUMNS.length);
    expect(onLoadMore.mock.calls.map(([column]) => (column as KanbanColumn).id)).toEqual([
      'todo',
      'done',
    ]);
  });

  it('stops asking for more once hasMore returns false for a column', () => {
    const onLoadMore = vi.fn();
    render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        infiniteScroll={{ onLoadMore, hasMore: (column) => column.id === 'todo' }}
      />,
    );

    intersectAll();

    expect(onLoadMore.mock.calls.map(([column]) => (column as KanbanColumn).id)).toEqual([
      'todo',
    ]);
  });

  it('does not fire while a column is loading', () => {
    const onLoadMore = vi.fn();
    render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        infiniteScroll={{ onLoadMore, hasMore: () => true, isLoading: () => true }}
      />,
    );

    intersectAll();

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('shows the end message once a column is fully loaded', () => {
    render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="scroll"
        infiniteScroll={{
          onLoadMore: vi.fn(),
          hasMore: () => false,
          endMessage: <span>All caught up</span>,
        }}
      />,
    );

    expect(screen.getAllByText('All caught up')).toHaveLength(COLUMNS.length);
  });

  it('logs a development error and renders nothing for columnOverflow="expand"', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const onLoadMore = vi.fn();

    const { container } = render(
      <KanbanBoard
        columns={COLUMNS}
        items={ITEMS}
        columnOverflow="expand"
        infiniteScroll={{ onLoadMore, hasMore: () => true }}
      />,
    );

    expect(container.querySelectorAll(SENTINEL)).toHaveLength(0);
    expect(error).toHaveBeenCalledOnce();
    expect(error.mock.calls[0]?.[0]).toContain('not implemented for columnOverflow');
  });
});
