import { describe, expect, it } from 'vitest';
import {
  extractColumnId,
  isColumnSortableId,
  toColumnSortableId,
} from '../../src/utils/column-sortable-id';

describe('column sortable ids', () => {
  describe('toColumnSortableId', () => {
    it('should prefix a column id', () => {
      expect(toColumnSortableId('todo')).toBe('column-todo');
    });

    it('should round-trip through extractColumnId', () => {
      expect(extractColumnId(toColumnSortableId('in-progress'))).toBe('in-progress');
    });
  });

  describe('isColumnSortableId', () => {
    it('should recognise a column-sortable id', () => {
      expect(isColumnSortableId('column-todo')).toBe(true);
    });

    it('should reject a card id', () => {
      expect(isColumnSortableId('todo')).toBe(false);
    });

    it('should reject an id that merely contains the prefix', () => {
      expect(isColumnSortableId('card-column-todo')).toBe(false);
    });

    it('should accept numeric ids without throwing', () => {
      expect(isColumnSortableId(42)).toBe(false);
    });
  });

  describe('extractColumnId', () => {
    it('should strip the prefix', () => {
      expect(extractColumnId('column-done')).toBe('done');
    });

    it('should return an empty string for a bare prefix', () => {
      expect(extractColumnId('column-')).toBe('');
    });
  });
});
