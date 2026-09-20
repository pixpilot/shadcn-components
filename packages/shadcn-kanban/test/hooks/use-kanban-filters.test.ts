import type {
  KanbanColumn,
  KanbanFilter,
  KanbanFilterChangeEvent,
  KanbanItem,
} from '../../src';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useKanbanFilters } from '../../src/hooks/use-kanban-filters';

interface Task {
  priority: 'high' | 'low';
}

const TODO: KanbanColumn = { id: 'todo', title: 'To Do' };
const DONE: KanbanColumn = { id: 'done', title: 'Done' };

const HIGH_PRIORITY: KanbanFilter<Task> = {
  id: 'high',
  label: 'High priority',
  predicate: (item) => item.data?.priority === 'high',
};

const TAGGED: KanbanFilter<Task> = { id: 'tagged', label: 'Tagged' };

const FILTERS: KanbanFilter<Task>[] = [HIGH_PRIORITY, TAGGED];

const ITEM: KanbanItem<Task> = {
  id: '1',
  name: 'Task',
  columnId: 'todo',
  data: { priority: 'high' },
};

describe('useKanbanFilters', () => {
  describe('resolveFilters', () => {
    it('should return an empty list when no filters are configured', () => {
      const { result } = renderHook(() => useKanbanFilters<Task>({}));

      expect(result.current.resolveFilters(TODO)).toEqual([]);
    });

    it('should share a flat filter list across every column', () => {
      const { result } = renderHook(() => useKanbanFilters<Task>({ filters: FILTERS }));

      expect(result.current.resolveFilters(TODO)).toBe(FILTERS);
      expect(result.current.resolveFilters(DONE)).toBe(FILTERS);
    });

    it('should resolve filters per column when given a function', () => {
      const filters = (column: KanbanColumn): KanbanFilter<Task>[] =>
        column.id === 'done' ? [TAGGED] : FILTERS;
      const { result } = renderHook(() => useKanbanFilters<Task>({ filters }));

      expect(result.current.resolveFilters(TODO)).toEqual(FILTERS);
      expect(result.current.resolveFilters(DONE)).toEqual([TAGGED]);
    });

    it('should treat an undefined resolver result as no filters', () => {
      const { result } = renderHook(() =>
        useKanbanFilters<Task>({ filters: () => undefined }),
      );

      expect(result.current.resolveFilters(TODO)).toEqual([]);
    });
  });

  describe('handleToggleFilter', () => {
    it('should activate a filter and report the change', () => {
      const onFilterChange = vi.fn<(event: KanbanFilterChangeEvent<Task>) => void>();
      const { result } = renderHook(() =>
        useKanbanFilters<Task>({ filters: FILTERS, onFilterChange }),
      );

      act(() => {
        result.current.handleToggleFilter(TODO, 'high');
      });

      expect(result.current.activeFilters).toEqual({ todo: ['high'] });
      expect(onFilterChange).toHaveBeenCalledWith({
        column: TODO,
        activeFilterIds: ['high'],
        activeFilters: [HIGH_PRIORITY],
      });
    });

    it('should deactivate a filter that is already active', () => {
      const { result } = renderHook(() => useKanbanFilters<Task>({ filters: FILTERS }));

      act(() => {
        result.current.handleToggleFilter(TODO, 'high');
      });
      act(() => {
        result.current.handleToggleFilter(TODO, 'high');
      });

      expect(result.current.activeFilters).toEqual({ todo: [] });
    });

    it('should accumulate multiple active filters on one column', () => {
      const { result } = renderHook(() => useKanbanFilters<Task>({ filters: FILTERS }));

      act(() => {
        result.current.handleToggleFilter(TODO, 'high');
      });
      act(() => {
        result.current.handleToggleFilter(TODO, 'tagged');
      });

      expect(result.current.activeFilters).toEqual({ todo: ['high', 'tagged'] });
    });

    it('should keep each column independent', () => {
      const { result } = renderHook(() => useKanbanFilters<Task>({ filters: FILTERS }));

      act(() => {
        result.current.handleToggleFilter(TODO, 'high');
      });
      act(() => {
        result.current.handleToggleFilter(DONE, 'tagged');
      });

      expect(result.current.activeFilters).toEqual({ todo: ['high'], done: ['tagged'] });
    });

    it('should not throw when no change handler is supplied', () => {
      const { result } = renderHook(() => useKanbanFilters<Task>({ filters: FILTERS }));

      expect(() => {
        act(() => {
          result.current.handleToggleFilter(TODO, 'high');
        });
      }).not.toThrow();
    });
  });

  describe('handleClearFilters', () => {
    it('should clear the active filters of a column and report it', () => {
      const onFilterChange = vi.fn<(event: KanbanFilterChangeEvent<Task>) => void>();
      const { result } = renderHook(() =>
        useKanbanFilters<Task>({ filters: FILTERS, onFilterChange }),
      );

      act(() => {
        result.current.handleToggleFilter(TODO, 'high');
      });
      onFilterChange.mockClear();

      act(() => {
        result.current.handleClearFilters(TODO);
      });

      expect(result.current.activeFilters).toEqual({ todo: [] });
      expect(onFilterChange).toHaveBeenCalledWith({
        column: TODO,
        activeFilterIds: [],
        activeFilters: [],
      });
    });

    it('should do nothing when the column has no active filters', () => {
      const onFilterChange = vi.fn<(event: KanbanFilterChangeEvent<Task>) => void>();
      const { result } = renderHook(() =>
        useKanbanFilters<Task>({ filters: FILTERS, onFilterChange }),
      );

      act(() => {
        result.current.handleClearFilters(TODO);
      });

      expect(result.current.activeFilters).toEqual({});
      expect(onFilterChange).not.toHaveBeenCalled();
    });

    it('should leave other columns untouched', () => {
      const { result } = renderHook(() => useKanbanFilters<Task>({ filters: FILTERS }));

      act(() => {
        result.current.handleToggleFilter(TODO, 'high');
      });
      act(() => {
        result.current.handleToggleFilter(DONE, 'tagged');
      });
      act(() => {
        result.current.handleClearFilters(TODO);
      });

      expect(result.current.activeFilters).toEqual({ todo: [], done: ['tagged'] });
    });
  });

  it('should report only the filters that exist on the column', () => {
    const onFilterChange = vi.fn<(event: KanbanFilterChangeEvent<Task>) => void>();
    const filters = (column: KanbanColumn): KanbanFilter<Task>[] =>
      column.id === 'done' ? [TAGGED] : FILTERS;
    const { result } = renderHook(() =>
      useKanbanFilters<Task>({ filters, onFilterChange }),
    );

    act(() => {
      result.current.handleToggleFilter(DONE, 'high');
    });

    expect(onFilterChange).toHaveBeenCalledWith({
      column: DONE,
      activeFilterIds: ['high'],
      activeFilters: [],
    });
    expect(HIGH_PRIORITY.predicate?.(ITEM, TODO)).toBe(true);
  });
});
