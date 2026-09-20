'use client';

import type {
  KanbanColumn,
  KanbanFilter,
  KanbanFilterChangeEvent,
  KanbanFilters,
} from '../types';

import React from 'react';

interface UseKanbanFiltersOptions<T> {
  filters?: KanbanFilters<T>;
  onFilterChange?: (event: KanbanFilterChangeEvent<T>) => void;
}

export interface UseKanbanFiltersResult<T> {
  activeFilters: Record<string, string[]>;
  resolveFilters: (column: KanbanColumn) => KanbanFilter<T>[];
  handleToggleFilter: (column: KanbanColumn, filterId: string) => void;
  handleClearFilters: (column: KanbanColumn) => void;
}

/** Tracks per-column active filters and notifies the parent about changes. */
export function useKanbanFilters<T>({
  filters,
  onFilterChange,
}: UseKanbanFiltersOptions<T>): UseKanbanFiltersResult<T> {
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string[]>>({});

  /** Resolve the filters available for a given column. */
  const resolveFilters = React.useCallback(
    (column: KanbanColumn): KanbanFilter<T>[] => {
      if (!filters) return [];
      const resolved = typeof filters === 'function' ? filters(column) : filters;
      return resolved ?? [];
    },
    [filters],
  );

  const emitFilterChange = React.useCallback(
    (column: KanbanColumn, nextActiveIds: string[]) => {
      if (!onFilterChange) return;
      const columnFilters = resolveFilters(column);
      onFilterChange({
        column,
        activeFilterIds: nextActiveIds,
        activeFilters: columnFilters.filter((f) => nextActiveIds.includes(f.id)),
      });
    },
    [onFilterChange, resolveFilters],
  );

  const handleToggleFilter = React.useCallback(
    (column: KanbanColumn, filterId: string) => {
      const current = activeFilters[column.id] ?? [];
      const next = current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId];
      setActiveFilters({ ...activeFilters, [column.id]: next });
      emitFilterChange(column, next);
    },
    [activeFilters, emitFilterChange],
  );

  const handleClearFilters = React.useCallback(
    (column: KanbanColumn) => {
      const current = activeFilters[column.id] ?? [];
      if (current.length === 0) return;

      setActiveFilters({ ...activeFilters, [column.id]: [] });
      emitFilterChange(column, []);
    },
    [activeFilters, emitFilterChange],
  );

  return { activeFilters, resolveFilters, handleToggleFilter, handleClearFilters };
}
