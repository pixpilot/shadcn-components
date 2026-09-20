import type { KanbanItem } from '../../src';

import { describe, expect, it } from 'vitest';
import { moveKanbanItem } from '../../src/utils/move-kanban-item';

const ITEMS: KanbanItem[] = [
  { id: 'source-first', name: 'Source first', columnId: 'source' },
  { id: 'active', name: 'Active', columnId: 'source' },
  { id: 'destination-first', name: 'Destination first', columnId: 'destination' },
  { id: 'destination-second', name: 'Destination second', columnId: 'destination' },
];

/** Ids of the cards in a column, in order. */
function idsIn(items: KanbanItem[], columnId: string): string[] {
  return items.filter((item) => item.columnId === columnId).map((item) => item.id);
}

describe('moveKanbanItem', () => {
  it('should place an item before the hovered destination item', () => {
    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'active',
      overId: 'destination-second',
      targetColumnId: 'destination',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(idsIn(result, 'destination')).toEqual([
      'destination-first',
      'active',
      'destination-second',
    ]);
    expect(idsIn(result, 'source')).toEqual(['source-first']);
  });

  it('should place an item after the hovered destination item', () => {
    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'active',
      overId: 'destination-second',
      targetColumnId: 'destination',
      insertAfter: true,
      overIsColumn: false,
    });

    expect(idsIn(result, 'destination')).toEqual([
      'destination-first',
      'destination-second',
      'active',
    ]);
  });

  it('should append an item when the destination column itself is targeted', () => {
    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'active',
      overId: 'destination',
      targetColumnId: 'destination',
      insertAfter: false,
      overIsColumn: true,
    });

    expect(idsIn(result, 'destination')).toEqual([
      'destination-first',
      'destination-second',
      'active',
    ]);
  });

  it('should append an item when the drop target card cannot be found', () => {
    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'active',
      overId: 'card-removed-mid-drag',
      targetColumnId: 'destination',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(idsIn(result, 'destination')).toEqual([
      'destination-first',
      'destination-second',
      'active',
    ]);
  });

  it('should place the item last overall when the target column is empty', () => {
    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'active',
      overId: 'empty',
      targetColumnId: 'empty',
      insertAfter: false,
      overIsColumn: true,
    });

    expect(idsIn(result, 'empty')).toEqual(['active']);
    expect(result.map((item) => item.id)).toEqual([
      'source-first',
      'destination-first',
      'destination-second',
      'active',
    ]);
  });

  it('should reorder within the same column when the target column is unchanged', () => {
    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'active',
      overId: 'source-first',
      targetColumnId: 'source',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(idsIn(result, 'source')).toEqual(['active', 'source-first']);
  });

  it('should return the original list when the dragged card is unknown', () => {
    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'missing',
      overId: 'destination-first',
      targetColumnId: 'destination',
      insertAfter: false,
      overIsColumn: false,
    });

    expect(result).toBe(ITEMS);
  });

  it('should not mutate the input list or its items', () => {
    const snapshot = structuredClone(ITEMS);

    const result = moveKanbanItem({
      items: ITEMS,
      activeId: 'active',
      overId: 'destination-first',
      targetColumnId: 'destination',
      insertAfter: true,
      overIsColumn: false,
    });

    expect(ITEMS).toEqual(snapshot);
    expect(result).not.toBe(ITEMS);
  });
});
