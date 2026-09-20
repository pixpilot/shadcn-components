import type { KanbanChangeEvent, KanbanColumn, KanbanItem } from '../../src';

import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  COLUMNS,
  dragEvent,
  idsIn,
  ITEMS,
  setupDrag,
  startEvent,
} from './kanban-drag-fixtures';

function titles(columns: KanbanColumn[]): string[] {
  return columns.map((column) => column.id);
}

describe('useKanbanDrag column reordering', () => {
  it('should reorder columns and report the new order', () => {
    const onColumnChange = vi.fn<(columns: KanbanColumn[]) => void>();
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onColumnChange,
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-todo'));
      result.current.handleDragEnd(dragEvent('column-todo', 'column-empty'));
    });

    expect(titles(result.current.internalColumns)).toEqual(['doing', 'empty', 'todo']);
    expect(onColumnChange).toHaveBeenCalledTimes(1);
    expect(titles(onColumnChange.mock.calls[0]?.[0] ?? [])).toEqual([
      'doing',
      'empty',
      'todo',
    ]);
  });

  it('should reorder backwards as well', () => {
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onColumnChange: vi.fn(),
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-empty'));
      result.current.handleDragEnd(dragEvent('column-empty', 'column-todo'));
    });

    expect(titles(result.current.internalColumns)).toEqual(['empty', 'todo', 'doing']);
  });

  it('should work without a column change handler', () => {
    const { result } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

    expect(() => {
      act(() => {
        result.current.handleDragStart(startEvent('column-todo'));
        result.current.handleDragEnd(dragEvent('column-todo', 'column-doing'));
      });
    }).not.toThrow();
    expect(titles(result.current.internalColumns)).toEqual(['doing', 'todo', 'empty']);
  });

  it('should ignore a column dropped on itself', () => {
    const onColumnChange = vi.fn<(columns: KanbanColumn[]) => void>();
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onColumnChange,
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-todo'));
      result.current.handleDragEnd(dragEvent('column-todo', 'column-todo'));
    });

    expect(result.current.internalColumns).toBe(COLUMNS);
    expect(onColumnChange).not.toHaveBeenCalled();
  });

  it('should ignore a column dropped outside any column', () => {
    const onColumnChange = vi.fn<(columns: KanbanColumn[]) => void>();
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onColumnChange,
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-todo'));
      result.current.handleDragEnd(dragEvent('column-todo', null));
    });

    expect(result.current.internalColumns).toBe(COLUMNS);
    expect(onColumnChange).not.toHaveBeenCalled();
  });

  it('should ignore a column dropped on a card', () => {
    const onColumnChange = vi.fn<(columns: KanbanColumn[]) => void>();
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onColumnChange,
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-todo'));
      result.current.handleDragEnd(dragEvent('column-todo', 'doing-1'));
    });

    expect(result.current.internalColumns).toBe(COLUMNS);
    expect(onColumnChange).not.toHaveBeenCalled();
  });

  it('should ignore a drop referencing a column that is no longer rendered', () => {
    const onColumnChange = vi.fn<(columns: KanbanColumn[]) => void>();
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onColumnChange,
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-archived'));
      result.current.handleDragEnd(dragEvent('column-archived', 'column-todo'));
    });

    expect(result.current.internalColumns).toBe(COLUMNS);
    expect(onColumnChange).not.toHaveBeenCalled();
  });

  it('should ignore a drop onto a column that is no longer rendered', () => {
    const onColumnChange = vi.fn<(columns: KanbanColumn[]) => void>();
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onColumnChange,
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-todo'));
      result.current.handleDragEnd(dragEvent('column-todo', 'column-archived'));
    });

    expect(result.current.internalColumns).toBe(COLUMNS);
    expect(onColumnChange).not.toHaveBeenCalled();
  });

  it('should not report a card change when a column is reordered', () => {
    const onChange = vi.fn<(event: KanbanChangeEvent) => void>();
    const { result } = setupDrag({
      externalItems: ITEMS,
      columns: COLUMNS,
      onChange,
      onColumnChange: vi.fn(),
    });

    act(() => {
      result.current.handleDragStart(startEvent('column-todo'));
      result.current.handleDragEnd(dragEvent('column-todo', 'column-doing'));
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('useKanbanDrag controlled props', () => {
  it('should mirror new items while idle', () => {
    const { result, rerender } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

    const next: KanbanItem[] = [
      ...ITEMS,
      { id: 'todo-3', name: 'Todo 3', columnId: 'todo' },
    ];
    rerender({ externalItems: next, columns: COLUMNS });

    expect(result.current.items).toBe(next);
  });

  it('should mirror new columns while idle', () => {
    const { result, rerender } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

    const next: KanbanColumn[] = [...COLUMNS].reverse();
    rerender({ externalItems: ITEMS, columns: next });

    expect(result.current.internalColumns).toBe(next);
  });

  it('should keep the drag preview when the parent re-renders mid-drag', () => {
    const { result, rerender } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

    act(() => {
      result.current.handleDragStart(startEvent('todo-1'));
      result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
    });

    /* A parent that rebuilds its items array on every render must not reset us. */
    rerender({ externalItems: [...ITEMS], columns: COLUMNS });

    expect(idsIn(result.current.items, 'doing')).toEqual(['todo-1', 'doing-1']);
  });

  it('should resume mirroring after the drop is committed', () => {
    const { result, rerender } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

    act(() => {
      result.current.handleDragStart(startEvent('todo-1'));
      result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
    });
    act(() => {
      result.current.handleDragEnd(dragEvent('todo-1', 'doing-1'));
    });

    const committed: KanbanItem[] = [...result.current.items];
    rerender({ externalItems: committed, columns: COLUMNS });

    expect(result.current.items).toBe(committed);
  });

  it('should resume mirroring after a cancelled drag', () => {
    const { result, rerender } = setupDrag({ externalItems: ITEMS, columns: COLUMNS });

    act(() => {
      result.current.handleDragStart(startEvent('todo-1'));
      result.current.handleDragOver(dragEvent('todo-1', 'doing-1'));
    });
    act(() => {
      result.current.handleDragCancel();
    });

    const next: KanbanItem[] = [...ITEMS].reverse();
    rerender({ externalItems: next, columns: COLUMNS });

    expect(result.current.items).toBe(next);
  });
});
