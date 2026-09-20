import type {
  KanbanColumn,
  KanbanFilter,
  KanbanFilterChangeEvent,
  KanbanItem,
} from '../src';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { KanbanBoard } from '../src';

/* Drag-and-drop is irrelevant to filtering, so stub it out. */
vi.mock('@dnd-kit/core', () => {
  const mockDroppable = () => ({ setNodeRef: () => undefined, isOver: false });
  return {
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

interface Task {
  priority: 'high' | 'low';
}

const COLUMNS: KanbanColumn[] = [{ id: 'todo', title: 'To Do' }];

const ITEMS: KanbanItem<Task>[] = [
  { id: '1', name: 'High task', columnId: 'todo', data: { priority: 'high' } },
  { id: '2', name: 'Low task', columnId: 'todo', data: { priority: 'low' } },
];

const FILTERS: KanbanFilter<Task>[] = [
  {
    id: 'high',
    label: 'High priority',
    predicate: (item) => item.data?.priority === 'high',
  },
];

/**
 * Click an option inside the column's filter popover by its label, opening
 * the popover first only when it isn't already showing that option (the
 * popover stays open after a selection so multiple filters can be toggled).
 */
function clickFilterOption(label: string) {
  if (!screen.queryByRole('button', { name: label })) {
    fireEvent.click(screen.getByLabelText('Filter column'));
  }
  fireEvent.click(screen.getByRole('button', { name: label }));
}

describe('kanbanBoard column filters', () => {
  it('disables touch panning on draggable cards', () => {
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

    expect(screen.getByText('High task').parentElement).toHaveClass('touch-none');
  });

  it('does not render a filter button when no filters are provided', () => {
    render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);
    expect(screen.queryByLabelText('Filter column')).not.toBeInTheDocument();
  });

  it('hides non-matching cards when a predicate filter is active', () => {
    render(<KanbanBoard<Task> columns={COLUMNS} items={ITEMS} filters={FILTERS} />);

    expect(screen.getByText('High task')).toBeInTheDocument();
    expect(screen.getByText('Low task')).toBeInTheDocument();

    clickFilterOption('High priority');

    expect(screen.getByText('High task')).toBeInTheDocument();
    expect(screen.queryByText('Low task')).not.toBeInTheDocument();
  });

  it('restores cards when the active filter is toggled off', () => {
    render(<KanbanBoard<Task> columns={COLUMNS} items={ITEMS} filters={FILTERS} />);

    clickFilterOption('High priority');
    expect(screen.queryByText('Low task')).not.toBeInTheDocument();

    clickFilterOption('High priority');
    expect(screen.getByText('Low task')).toBeInTheDocument();
  });

  it('fires onFilterChange with the active filters for the column', () => {
    const onFilterChange = vi.fn();
    render(
      <KanbanBoard<Task>
        columns={COLUMNS}
        items={ITEMS}
        filters={FILTERS}
        onFilterChange={onFilterChange}
      />,
    );

    clickFilterOption('High priority');

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    const event = onFilterChange.mock.calls.at(0)?.[0] as KanbanFilterChangeEvent<Task>;
    expect(event.column.id).toBe('todo');
    expect(event.activeFilterIds).toEqual(['high']);
    expect(event.activeFilters.map((f) => f.label)).toEqual(['High priority']);
  });

  it('does not filter cards for filters without a predicate (external mode)', () => {
    const onFilterChange = vi.fn();
    const externalFilters: KanbanFilter<Task>[] = [
      { id: 'high', label: 'High priority' },
    ];

    render(
      <KanbanBoard<Task>
        columns={COLUMNS}
        items={ITEMS}
        filters={externalFilters}
        onFilterChange={onFilterChange}
      />,
    );

    clickFilterOption('High priority');

    /* Board reports the change but leaves the cards untouched. */
    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('High task')).toBeInTheDocument();
    expect(screen.getByText('Low task')).toBeInTheDocument();
  });

  it('shows a clear action that removes all active filters', () => {
    render(<KanbanBoard<Task> columns={COLUMNS} items={ITEMS} filters={FILTERS} />);

    clickFilterOption('High priority');
    expect(screen.queryByText('Low task')).not.toBeInTheDocument();

    /* The popover stays open after a selection, so the clear action is visible. */
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(screen.getByText('Low task')).toBeInTheDocument();
  });

  it('only shows filters returned by a per-column resolver', () => {
    const columns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do' },
      { id: 'done', title: 'Done' },
    ];
    const items: KanbanItem<Task>[] = [
      { id: '1', name: 'A', columnId: 'todo', data: { priority: 'high' } },
      { id: '2', name: 'B', columnId: 'done', data: { priority: 'low' } },
    ];
    const resolver = (column: KanbanColumn) =>
      column.id === 'todo' ? FILTERS : undefined;

    render(<KanbanBoard<Task> columns={columns} items={items} filters={resolver} />);

    /* Only the "To Do" column resolves to filters, so exactly one button. */
    expect(screen.getAllByLabelText('Filter column')).toHaveLength(1);
  });
});
