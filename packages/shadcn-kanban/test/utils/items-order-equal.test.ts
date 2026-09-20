import type { KanbanItem } from '../../src';

import { describe, expect, it } from 'vitest';
import { itemsOrderEqual } from '../../src/utils/items-order-equal';

const ITEMS: KanbanItem[] = [
  { id: 'a', name: 'A', columnId: 'todo' },
  { id: 'b', name: 'B', columnId: 'done' },
];

describe('itemsOrderEqual', () => {
  it('should treat a list as equal to itself', () => {
    expect(itemsOrderEqual(ITEMS, ITEMS)).toBe(true);
  });

  it('should treat structurally identical lists as equal', () => {
    expect(itemsOrderEqual(ITEMS, structuredClone(ITEMS))).toBe(true);
  });

  it('should ignore changes to fields a drag cannot touch', () => {
    const renamed: KanbanItem[] = [
      { id: 'a', name: 'Renamed', columnId: 'todo' },
      { id: 'b', name: 'B', columnId: 'done', data: { extra: true } },
    ];

    expect(itemsOrderEqual(ITEMS, renamed)).toBe(true);
  });

  it('should detect a reordering', () => {
    expect(itemsOrderEqual(ITEMS, [...ITEMS].reverse())).toBe(false);
  });

  it('should detect a column change', () => {
    const moved: KanbanItem[] = [{ ...ITEMS[0]!, columnId: 'done' }, ITEMS[1]!];

    expect(itemsOrderEqual(ITEMS, moved)).toBe(false);
  });

  it('should detect a different length', () => {
    expect(itemsOrderEqual(ITEMS, [ITEMS[0]!])).toBe(false);
  });

  it('should treat two empty lists as equal', () => {
    expect(itemsOrderEqual([], [])).toBe(true);
  });

  it('should not confuse lists whose ids contain separator characters', () => {
    const a: KanbanItem[] = [{ id: 'x:y', name: 'X', columnId: 'z' }];
    const b: KanbanItem[] = [{ id: 'x', name: 'X', columnId: 'y:z' }];

    expect(itemsOrderEqual(a, b)).toBe(false);
  });
});
