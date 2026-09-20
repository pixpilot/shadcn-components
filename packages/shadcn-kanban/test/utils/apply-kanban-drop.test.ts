import type { KanbanItem } from '../../src';

import { describe, expect, it } from 'vitest';
import { applyKanbanDrop } from '../../src/utils/apply-kanban-drop';

const ITEMS: KanbanItem[] = [
  { id: 'todo-1', name: 'Todo 1', columnId: 'todo' },
  { id: 'todo-2', name: 'Todo 2', columnId: 'todo' },
  { id: 'done-1', name: 'Done 1', columnId: 'done' },
];

function ids(items: KanbanItem[]): string[] {
  return items.map((item) => item.id);
}

describe('applyKanbanDrop', () => {
  it('should reorder within a column when dropped on a sibling card', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'todo-2',
      overColumnId: 'todo',
      insertAfter: true,
      overIsColumn: false,
    });

    expect(ids(result)).toEqual(['todo-2', 'todo-1', 'done-1']);
  });

  it('should return the same list when a card is dropped on itself', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'todo-1',
      overColumnId: 'todo',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(result).toBe(ITEMS);
  });

  it('should move a card onto another column when dropped on one of its cards', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'done-1',
      overColumnId: 'done',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(result.find((item) => item.id === 'todo-1')?.columnId).toBe('done');
    expect(ids(result)).toEqual(['todo-2', 'todo-1', 'done-1']);
  });

  it('should move a card onto an empty column dropped on the column itself', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'archive',
      overColumnId: 'archive',
      insertAfter: false,
      overIsColumn: true,
    });

    expect(result.find((item) => item.id === 'todo-1')?.columnId).toBe('archive');
    expect(ids(result)).toEqual(['todo-2', 'done-1', 'todo-1']);
  });

  it('should honour insertAfter when crossing columns', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'done-1',
      overColumnId: 'done',
      insertAfter: true,
      overIsColumn: false,
    });

    expect(ids(result)).toEqual(['todo-2', 'done-1', 'todo-1']);
  });

  it('should leave the list untouched when the drop target column is unresolvable', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'unknown-target',
      overColumnId: undefined,
      insertAfter: false,
      overIsColumn: false,
    });

    expect(result).toBe(ITEMS);
  });

  it('should leave the list untouched when dropped on its own column shell', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'todo',
      overColumnId: 'todo',
      insertAfter: false,
      overIsColumn: true,
    });

    expect(result).toBe(ITEMS);
  });

  it('should leave the list untouched when the dragged card is unknown', () => {
    const result = applyKanbanDrop({
      items: ITEMS,
      activeId: 'ghost',
      overId: 'done-1',
      overColumnId: 'done',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(result).toBe(ITEMS);
  });

  it('should not mutate the input list', () => {
    const snapshot = structuredClone(ITEMS);

    applyKanbanDrop({
      items: ITEMS,
      activeId: 'todo-1',
      overId: 'done-1',
      overColumnId: 'done',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(ITEMS).toEqual(snapshot);
  });
});
