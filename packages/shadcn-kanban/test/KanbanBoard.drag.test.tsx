import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import type { KanbanChangeEvent, KanbanColumn, KanbanItem } from '../src';

import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KanbanBoard } from '../src';

const dndHandlers = vi.hoisted(() => ({
  onDragStart: undefined as ((event: DragStartEvent) => void) | undefined,
  onDragOver: undefined as ((event: DragOverEvent) => void) | undefined,
  onDragEnd: undefined as ((event: DragEndEvent) => void) | undefined,
}));

vi.mock('@dnd-kit/core', () => {
  const mockDroppable = () => ({ setNodeRef: vi.fn(), isOver: false });
  return {
    DndContext: ({
      children,
      ...handlers
    }: React.PropsWithChildren<typeof dndHandlers>) => {
      Object.assign(dndHandlers, handlers);
      return <div>{children}</div>;
    },
    DragOverlay: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    useDroppable: mockDroppable,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    MouseSensor: vi.fn(),
    TouchSensor: vi.fn(),
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
  };
});

vi.mock('@dnd-kit/sortable', () => {
  const mockSortable = () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  });
  return {
    SortableContext: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    useSortable: mockSortable,
    arrayMove: <T,>(items: T[], from: number, to: number) => {
      const next = [...items];
      const [item] = next.splice(from, 1);
      if (item !== undefined) next.splice(to, 0, item);
      return next;
    },
    horizontalListSortingStrategy: vi.fn(),
    verticalListSortingStrategy: vi.fn(),
    sortableKeyboardCoordinates: vi.fn(),
  };
});

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

const COLUMNS: KanbanColumn[] = [
  { id: 'source', title: 'Source' },
  { id: 'destination', title: 'Destination' },
  { id: 'empty', title: 'Empty' },
];

const ITEMS: KanbanItem[] = [
  { id: 'active', name: 'Active', columnId: 'source' },
  { id: 'first', name: 'First', columnId: 'destination' },
  { id: 'second', name: 'Second', columnId: 'destination' },
];

/** Rect for a card sitting at 100..150; the dragged card is "below" past 150. */
const OVER_RECT = { top: 100, height: 50 };

function dragEvent(activeTop: number, overId: string) {
  return {
    active: { id: 'active', rect: { current: { translated: { top: activeTop } } } },
    over: { id: overId, rect: OVER_RECT },
  } as unknown as DragOverEvent & DragEndEvent;
}

function columnOf(itemTestId: string): HTMLElement | null | undefined {
  return screen.getByTestId(itemTestId).parentElement?.parentElement?.parentElement;
}

describe('kanbanBoard drag ordering', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('previews a cross-column move immediately during drag-over', () => {
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: 'active' } } as DragStartEvent);
      dndHandlers.onDragOver?.(dragEvent(126, 'first'));
    });

    expect(columnOf('kanban-item-active')).toHaveTextContent('Destination');
  });

  it('moves an item into an empty column when dropped over the column itself', () => {
    const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} onChange={onChange} />);

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: 'active' } } as DragStartEvent);
      dndHandlers.onDragOver?.(dragEvent(126, 'empty'));
      dndHandlers.onDragEnd?.(dragEvent(126, 'empty'));
    });

    const change = onChange.mock.calls[0]?.[0];
    expect(change?.previousColumnId).toBe('source');
    expect(change?.nextColumnId).toBe('empty');
    expect(change?.items.filter((i) => i.columnId === 'empty').map((i) => i.id)).toEqual([
      'active',
    ]);
  });

  it('places a cross-column item before the hovered card when dropped above its bottom edge', () => {
    const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} onChange={onChange} />);

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: 'active' } } as DragStartEvent);
      dndHandlers.onDragEnd?.(dragEvent(126, 'first'));
    });

    const change = onChange.mock.calls[0]?.[0];
    expect(
      change?.items
        .filter((item) => item.columnId === 'destination')
        .map((item) => item.id),
    ).toEqual(['active', 'first', 'second']);
  });

  it('places a cross-column item after the hovered card when dropped past its bottom edge', () => {
    const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} onChange={onChange} />);

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: 'active' } } as DragStartEvent);
      dndHandlers.onDragEnd?.(dragEvent(151, 'first'));
    });

    const change = onChange.mock.calls[0]?.[0];
    expect(
      change?.items
        .filter((item) => item.columnId === 'destination')
        .map((item) => item.id),
    ).toEqual(['first', 'active', 'second']);
  });

  it('reorders within the same column on drop', () => {
    const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} onChange={onChange} />);

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: 'first' } } as DragStartEvent);
      dndHandlers.onDragEnd?.({
        active: { id: 'first', rect: { current: { translated: { top: 160 } } } },
        over: { id: 'second', rect: { top: 150, height: 50 } },
      } as unknown as DragEndEvent);
    });

    const change = onChange.mock.calls[0]?.[0];
    expect(change?.previousColumnId).toBe('destination');
    expect(change?.nextColumnId).toBe('destination');
    expect(
      change?.items
        .filter((item) => item.columnId === 'destination')
        .map((item) => item.id),
    ).toEqual(['second', 'first']);
  });

  it('does not fire onChange when the item is dropped back in place', () => {
    const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} onChange={onChange} />);

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: 'active' } } as DragStartEvent);
      dndHandlers.onDragEnd?.(dragEvent(126, 'active'));
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('restores the drag-start order when the drop lands nowhere', () => {
    const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} onChange={onChange} />);

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: 'active' } } as DragStartEvent);
      dndHandlers.onDragOver?.(dragEvent(126, 'first'));
      dndHandlers.onDragEnd?.({
        active: { id: 'active', rect: { current: { translated: { top: 126 } } } },
        over: null,
      } as unknown as DragEndEvent);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(columnOf('kanban-item-active')).toHaveTextContent('Source');
  });
});
