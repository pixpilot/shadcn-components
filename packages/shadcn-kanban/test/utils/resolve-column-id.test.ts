import type { KanbanItem } from '../../src';

import { describe, expect, it } from 'vitest';
import { isColumnDroppableId, resolveColumnId } from '../../src/utils/resolve-column-id';

const COLUMN_IDS = new Set(['todo', 'done']);

const ITEMS: KanbanItem[] = [
  { id: 'card-1', name: 'Card 1', columnId: 'todo' },
  { id: 'card-2', name: 'Card 2', columnId: 'done' },
];

describe('isColumnDroppableId', () => {
  it('should accept a known column id', () => {
    expect(isColumnDroppableId('todo', COLUMN_IDS)).toBe(true);
  });

  it('should accept a column-sortable id', () => {
    expect(isColumnDroppableId('column-todo', COLUMN_IDS)).toBe(true);
  });

  it('should reject a card id', () => {
    expect(isColumnDroppableId('card-1', COLUMN_IDS)).toBe(false);
  });
});

describe('resolveColumnId', () => {
  it('should resolve a column id to itself', () => {
    expect(resolveColumnId('done', COLUMN_IDS, ITEMS)).toBe('done');
  });

  it('should resolve a column-sortable id to its column', () => {
    expect(resolveColumnId('column-done', COLUMN_IDS, ITEMS)).toBe('done');
  });

  it('should resolve a card id to the column it sits in', () => {
    expect(resolveColumnId('card-2', COLUMN_IDS, ITEMS)).toBe('done');
  });

  it('should return undefined for a column-sortable id of an unknown column', () => {
    expect(resolveColumnId('column-archived', COLUMN_IDS, ITEMS)).toBeUndefined();
  });

  it('should return undefined for an id that matches nothing on the board', () => {
    expect(resolveColumnId('card-removed', COLUMN_IDS, ITEMS)).toBeUndefined();
  });
});
