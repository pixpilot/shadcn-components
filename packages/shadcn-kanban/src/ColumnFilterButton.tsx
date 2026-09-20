'use client';

import type { KanbanFilter } from './types';

import { cn, Popover, PopoverContent, PopoverTrigger } from '@pixpilot/shadcn-ui';
import { Check, Filter } from 'lucide-react';
import React from 'react';

interface ColumnFilterButtonProps<T> {
  /** Filters available for this column. */
  filters: KanbanFilter<T>[];
  /** Ids of the filters currently active on this column. */
  activeFilterIds: string[];
  /** Toggle a single filter on/off. */
  onToggle: (filterId: string) => void;
  /** Clear every active filter on this column. */
  onClear: () => void;
}

/**
 * A filter icon button rendered in a Kanban column header. Clicking it opens
 * a popover listing the column's filters; selecting one toggles it. A badge
 * shows how many filters are currently active.
 */
export function ColumnFilterButton<T = Record<string, unknown>>({
  filters,
  activeFilterIds,
  onToggle,
  onClear,
}: ColumnFilterButtonProps<T>) {
  const activeCount = activeFilterIds.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Filter column"
          className={cn(
            'text-muted-foreground hover:text-foreground relative rounded p-0.5 transition-colors',
            activeCount > 0 && 'text-primary',
          )}
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 ? (
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[10px] leading-none font-medium">
              {activeCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-1">
        <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
          Filters
        </div>

        <ul className="flex flex-col">
          {filters.map((filter) => {
            const active = activeFilterIds.includes(filter.id);
            return (
              <li key={filter.id}>
                <button
                  type="button"
                  onClick={() => onToggle(filter.id)}
                  aria-pressed={active}
                  className={cn(
                    'hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                    active && 'text-foreground font-medium',
                  )}
                >
                  <span className="truncate">{filter.label}</span>
                  {active ? <Check className="text-primary h-4 w-4 shrink-0" /> : null}
                </button>
              </li>
            );
          })}
        </ul>

        {activeCount > 0 ? (
          <>
            <div className="bg-border my-1 h-px" />
            <button
              type="button"
              onClick={onClear}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors"
            >
              Clear filters
            </button>
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
