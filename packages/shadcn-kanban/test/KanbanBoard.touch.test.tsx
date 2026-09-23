import type { KanbanColumn, KanbanItem } from '../src';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { KanbanBoard } from '../src';

/* Real dragging needs layout jsdom cannot provide, so dnd-kit is stubbed out.
   These tests are about the markup a touch screen depends on, not the drag. */
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DragOverlay: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  useDroppable: () => ({ setNodeRef: () => undefined, isOver: false }),
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
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => undefined,
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
  arrayMove: <T,>(arr: T[]) => arr,
  horizontalListSortingStrategy: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
  sortableKeyboardCoordinates: vi.fn(),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'done', title: 'Done' },
];

const ITEMS: KanbanItem[] = [
  { id: '1', name: 'Research competitors', columnId: 'todo' },
  { id: '2', name: 'Ship it', columnId: 'done' },
];

const board = () => screen.getByTestId('kanban-board');
const card = (id: string) => screen.getByTestId(`kanban-item-${id}`);
const column = (id: string) => screen.getByTestId(`kanban-column-${id}`);

describe('kanbanBoard on touch screens', () => {
  describe('card gestures', () => {
    it('should leave both scroll axes reachable through a card', () => {
      render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

      /* A card sits inside two scrollers the finger still has to reach: the
         column vertically and the board horizontally. */
      expect(card('1')).toHaveClass('touch-manipulation');
      expect(card('1')).not.toHaveClass('touch-none');
    });

    it('should not show a hold state before anything is held', () => {
      render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

      expect(card('1')).not.toHaveAttribute('data-pressing');
    });

    it('should acknowledge a hold while it is still a hold', () => {
      render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

      fireEvent.touchStart(card('1'), { touches: [{ clientX: 5, clientY: 5 }] });

      expect(card('1')).toHaveAttribute('data-pressing');
    });

    it('should drop the hold state once the finger starts scrolling', () => {
      render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

      fireEvent.touchStart(card('1'), { touches: [{ clientX: 5, clientY: 5 }] });
      fireEvent.touchMove(card('1'), { touches: [{ clientX: 120, clientY: 5 }] });

      expect(card('1')).not.toHaveAttribute('data-pressing');
    });

    it('should stay silent when press feedback is turned off', () => {
      render(
        <KanbanBoard columns={COLUMNS} items={ITEMS} touch={{ pressFeedback: false }} />,
      );

      fireEvent.touchStart(card('1'), { touches: [{ clientX: 5, clientY: 5 }] });

      expect(card('1')).not.toHaveAttribute('data-pressing');
    });
  });

  describe('column snapping', () => {
    it('should snap by default, below the sm breakpoint only', () => {
      render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

      expect(board()).toHaveAttribute('data-snapping');
      expect(board()).toHaveClass('max-sm:snap-mandatory');
      expect(column('todo')).toHaveClass('max-sm:snap-start');
    });

    it('should size a snapped column from the board-level custom property', () => {
      render(<KanbanBoard columns={COLUMNS} items={ITEMS} />);

      expect(board().style.getPropertyValue('--kanban-column-snap-width')).toBe('85%');
    });

    it('should take a custom width and alignment', () => {
      render(
        <KanbanBoard
          columns={COLUMNS}
          items={ITEMS}
          columnSnap={{ align: 'center', columnWidth: '18rem' }}
        />,
      );

      expect(board().style.getPropertyValue('--kanban-column-snap-width')).toBe('18rem');
      expect(column('todo')).toHaveClass('max-sm:snap-center');
    });

    it('should stay a plain scroller when snapping is off', () => {
      render(<KanbanBoard columns={COLUMNS} items={ITEMS} columnSnap={false} />);

      expect(board()).not.toHaveAttribute('data-snapping');
      expect(board()).not.toHaveClass('max-sm:snap-mandatory');
      expect(column('todo')).not.toHaveClass('max-sm:snap-start');
    });

    it('should keep the add-column button on a snap point', () => {
      render(
        <KanbanBoard
          columns={COLUMNS}
          items={ITEMS}
          allowAddColumn
          onAddColumn={() => undefined}
        />,
      );

      /* Under `snap-mandatory` a child with no snap point is somewhere the
         scroller refuses to rest, which would strand the button on a phone. */
      expect(screen.getByRole('button', { name: 'Add column' })).toHaveClass(
        'max-sm:snap-start',
      );
    });
  });

  describe('the column drag handle', () => {
    it('should be marked so a touch drag can skip the hold', () => {
      render(
        <KanbanBoard columns={COLUMNS} items={ITEMS} onColumnChange={() => undefined} />,
      );

      expect(
        screen.getByRole('button', { name: 'Reorder To Do column' }),
      ).toHaveAttribute('data-kanban-drag-handle');
    });
  });
});
