'use client';

import type { ColumnOverflow, KanbanBoardProps } from './types';

import { DndContext, MeasuringStrategy } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { AddColumnButton } from './AddColumnButton';
import { useKanbanDrag } from './hooks/use-kanban-drag';
import { useKanbanFilters } from './hooks/use-kanban-filters';
import { KanbanColumn } from './KanbanColumn';
import { KanbanDragOverlay } from './KanbanDragOverlay';
import { toColumnSortableId } from './utils/column-sortable-id';
import { resolveColumnSnap } from './utils/resolve-column-snap';

/* Hoisted so dnd-kit does not rebuild its measuring config on every render. */
const MEASURING = { droppable: { strategy: MeasuringStrategy.Always } };

/**
 * Warns once, in development only, when a scroll-only feature is requested for
 * a column mode that cannot support it. Deliberately non-throwing: a mis-set
 * prop should not take a board down in production.
 */
function useScrollOnlyFeatureWarning(
  feature: string,
  consequence: string,
  requested: boolean,
  columnOverflow: ColumnOverflow,
) {
  const warned = React.useRef(false);

  React.useEffect(() => {
    // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
    if (process.env.NODE_ENV === 'production') return;
    if (!requested || columnOverflow === 'scroll' || warned.current) return;

    warned.current = true;
    console.error(
      `[KanbanBoard] \`${feature}\` is not implemented for columnOverflow="${columnOverflow}" — ` +
        `only "scroll" is supported. ${consequence}`,
    );
  }, [feature, consequence, requested, columnOverflow]);
}

/**
 * A generic, reusable Kanban board with drag-and-drop powered by `@dnd-kit`.
 *
 * Accepts an array of {@link KanbanItem} items and {@link KanbanColumn}
 * column definitions and calls `onChange` whenever an item is moved
 * between (or within) columns.
 */
export function KanbanBoard<T = Record<string, unknown>>({
  items: externalItems,
  columns,
  onChange,
  renderItem,
  renderColumnHeader,
  className,
  style,
  columnClassName,
  getColumnProps,
  hideColumnHeaders = false,
  itemClassName,
  columnOverflow = 'scroll',
  allowAddColumn,
  onAddColumn,
  onColumnChange,
  filters,
  onFilterChange,
  infiniteScroll,
  virtualization,
  dragDisabled = false,
  touch,
  columnSnap = true,
}: KanbanBoardProps<T>) {
  useScrollOnlyFeatureWarning(
    'infiniteScroll',
    'The sentinel will not be rendered.',
    Boolean(infiniteScroll),
    columnOverflow,
  );
  useScrollOnlyFeatureWarning(
    'virtualization',
    'Every card will be rendered.',
    Boolean(virtualization),
    columnOverflow,
  );

  /* An expanding column has no scroll edge, so there is nothing to observe. */
  const activeInfiniteScroll = columnOverflow === 'scroll' ? infiniteScroll : undefined;
  /* Same reason: an expanding column has no window to virtualize against. */
  const activeVirtualization =
    columnOverflow === 'scroll' && virtualization?.disabled !== true
      ? virtualization
      : undefined;

  const {
    items,
    internalColumns,
    activeId,
    isDraggingColumn,
    sensors,
    collisionDetection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useKanbanDrag<T>({ externalItems, columns, onChange, onColumnChange, touch });

  const snap = resolveColumnSnap(columnSnap, activeId !== null);

  const { activeFilters, resolveFilters, handleToggleFilter, handleClearFilters } =
    useKanbanFilters<T>({ filters, onFilterChange });

  const activeItem =
    activeId !== null && !isDraggingColumn
      ? (items.find((i) => i.id === activeId) ?? null)
      : null;
  const activeItemColumn = activeItem
    ? internalColumns.find((c) => c.id === activeItem.columnId)
    : undefined;
  const activeColumn =
    activeId !== null && isDraggingColumn
      ? internalColumns.find((c) => toColumnSortableId(c.id) === String(activeId))
      : undefined;

  const columnItemsMap = React.useMemo(
    () =>
      internalColumns.map((col) => {
        const colFilters = resolveFilters(col);
        const activeIds = activeFilters[col.id] ?? [];
        const activePredicates = colFilters.filter(
          (f) => activeIds.includes(f.id) && typeof f.predicate === 'function',
        );

        let colItems = items.filter((i) => i.columnId === col.id);
        if (activePredicates.length > 0) {
          colItems = colItems.filter((item) =>
            activePredicates.every((f) => f.predicate!(item, col)),
          );
        }

        return { column: col, colItems, colFilters, activeIds };
      }),
    [internalColumns, items, resolveFilters, activeFilters],
  );

  const columnSortableIds = React.useMemo(
    () => internalColumns.map((c) => toColumnSortableId(c.id)),
    [internalColumns],
  );

  const isColumnSortable = Boolean(onColumnChange) && !dragDisabled;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      measuring={MEASURING}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={columnSortableIds} strategy={horizontalListSortingStrategy}>
        <div
          data-testid="kanban-board"
          data-snapping={snap.enabled ? '' : undefined}
          className={cn(
            /* `relative` so absolutely positioned descendants (e.g. `sr-only`
               labels) resolve against this scroller instead of an ancestor,
               which would let them escape clipping and scroll the page. */
            'relative flex gap-4 overflow-x-auto overscroll-x-contain p-2',
            columnOverflow === 'scroll' ? 'h-full min-h-0' : 'min-h-full',
            snap.boardClassName,
            className,
          )}
          style={{ ...snap.style, ...style }}
        >
          {columnItemsMap.map(({ column, colItems, colFilters, activeIds }) => (
            <KanbanColumn
              key={column.id}
              column={column}
              items={colItems}
              renderItem={renderItem}
              renderColumnHeader={renderColumnHeader}
              columnClassName={cn(snap.columnClassName, columnClassName)}
              containerProps={getColumnProps?.(column)}
              hideHeader={hideColumnHeaders}
              itemClassName={itemClassName}
              sortable={isColumnSortable}
              filters={colFilters}
              activeFilterIds={activeIds}
              columnOverflow={columnOverflow}
              infiniteScroll={activeInfiniteScroll}
              virtualization={activeVirtualization}
              dragDisabled={dragDisabled}
              touch={touch}
              activeItemId={activeItem?.id ?? null}
              onToggleFilter={(filterId) => handleToggleFilter(column, filterId)}
              onClearFilters={() => handleClearFilters(column)}
            />
          ))}

          {/* Snaps like a column: under `snap-mandatory` a child with no snap
              point of its own is a place the scroller refuses to rest, which
              would leave the button unreachable on a phone. */}
          {allowAddColumn && onAddColumn ? (
            <AddColumnButton onAdd={onAddColumn} className={snap.columnClassName} />
          ) : null}
        </div>
      </SortableContext>

      <KanbanDragOverlay
        activeItem={activeItem}
        activeItemColumn={activeItemColumn}
        activeColumn={activeColumn}
        activeColumnItemCount={
          activeColumn ? items.filter((i) => i.columnId === activeColumn.id).length : 0
        }
        renderItem={renderItem}
        itemClassName={itemClassName}
        columnClassName={columnClassName}
      />
    </DndContext>
  );
}
