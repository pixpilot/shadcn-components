'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import type {
  ColumnOverflow,
  KanbanColumn as KanbanColumnType,
  KanbanFilter,
  KanbanInfiniteScroll,
  KanbanItem as KanbanItemType,
  KanbanTouchOptions,
  KanbanVirtualization,
} from './types';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@pixpilot/shadcn-ui';
import { GripVertical } from 'lucide-react';
import React from 'react';
import { ColumnFilterButton } from './ColumnFilterButton';
import { InfiniteScrollSentinel } from './infinite-scroll';
import { KanbanColumnCards } from './KanbanColumnCards';
import { KanbanVirtualColumnCards } from './KanbanVirtualColumnCards';
import { toColumnSortableId } from './utils/column-sortable-id';
import { dragHandleProps } from './utils/kanban-touch-defaults';

interface KanbanColumnProps<T> {
  column: KanbanColumnType;
  items: KanbanItemType<T>[];
  renderItem?: (item: KanbanItemType<T>, column: KanbanColumnType) => React.ReactNode;
  renderColumnHeader?: (column: KanbanColumnType, itemCount: number) => React.ReactNode;
  columnClassName?: string;
  itemClassName?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  hideHeader?: boolean;
  /** When true the column itself is draggable (sortable). */
  sortable?: boolean;
  /** Filters available for this column (empty when the column has none). */
  filters?: KanbanFilter<T>[];
  /** Ids of the filters currently active on this column. */
  activeFilterIds?: string[];
  /** Controls whether overflowing cards scroll internally or expand the column. */
  columnOverflow: ColumnOverflow;
  /** When set, renders a load-more sentinel at the bottom of the card list. */
  infiniteScroll?: KanbanInfiniteScroll;
  /** When set, only the cards near the column's scroll window are mounted. */
  virtualization?: KanbanVirtualization;
  /** Freezes dragging of this column's cards. */
  dragDisabled?: boolean;
  /** Hold-to-drag tuning, forwarded to every card. */
  touch?: KanbanTouchOptions;
  /** The card being dragged board-wide, so it stays mounted while virtualized. */
  activeItemId?: UniqueIdentifier | null;
  /** Toggle a single filter on this column. */
  onToggleFilter?: (filterId: string) => void;
  /** Clear all active filters on this column. */
  onClearFilters?: () => void;
}

export function KanbanColumn<T = Record<string, unknown>>({
  column,
  items,
  renderItem,
  renderColumnHeader,
  columnClassName,
  itemClassName,
  containerProps,
  hideHeader = false,
  sortable = false,
  filters,
  activeFilterIds,
  columnOverflow,
  infiniteScroll,
  virtualization,
  dragDisabled = false,
  touch,
  activeItemId = null,
  onToggleFilter,
  onClearFilters,
}: KanbanColumnProps<T>) {
  const {
    className: containerClassName,
    style: containerStyle,
    ...containerAttributes
  } = containerProps ?? {};
  const filterButton =
    filters && filters.length > 0 && onToggleFilter && onClearFilters ? (
      <ColumnFilterButton
        filters={filters}
        activeFilterIds={activeFilterIds ?? []}
        onToggle={onToggleFilter}
        onClear={onClearFilters}
      />
    ) : null;

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: toColumnSortableId(column.id),
    data: { type: 'column-sortable', column },
    disabled: !sortable,
  });

  const style: React.CSSProperties = sortable
    ? {
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }
    : {};

  const itemIds = React.useMemo(() => items.map((i) => i.id), [items]);

  /*
   * Both the sentinel and the virtualizer measure against this column's own
   * scroller, so the node has to live in state — a ref would not re-render
   * once it lands, leaving the observer measuring against the viewport and the
   * virtualizer with nothing to measure at all.
   */
  const [scroller, setScroller] = React.useState<HTMLDivElement | null>(null);
  const setScrollerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setDroppableRef(node);
      setScroller(node);
    },
    [setDroppableRef],
  );

  return (
    <div
      ref={setSortableRef}
      data-testid={`kanban-column-${column.id}`}
      style={{ ...containerStyle, ...style }}
      className={cn(
        'bg-muted/40 relative flex min-w-[250px] flex-1 flex-col rounded-lg border',
        columnOverflow === 'scroll'
          ? 'h-full min-h-0 overflow-hidden'
          : 'min-h-full overflow-visible',
        isOver && 'ring-primary/30 ring-2',
        isDragging && 'opacity-50',
        columnClassName,
        containerClassName,
      )}
      {...(sortable ? attributes : {})}
      {...containerAttributes}
    >
      {/* Column header */}
      {!hideHeader &&
        (renderColumnHeader ? (
          <div className="flex items-center gap-1 px-3 pt-3 pb-3">
            {sortable ? (
              <button
                type="button"
                aria-label={`Reorder ${column.title} column`}
                className="text-muted-foreground hover:text-foreground -m-1 cursor-grab touch-none p-1 active:cursor-grabbing"
                {...dragHandleProps}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </button>
            ) : null}
            <div className="flex-1">{renderColumnHeader(column, items.length)}</div>
            {filterButton}
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 pt-3 pb-3">
            <div className="flex items-center gap-1">
              {sortable ? (
                <button
                  type="button"
                  aria-label={`Reorder ${column.title} column`}
                  className="text-muted-foreground hover:text-foreground -m-1 cursor-grab touch-none p-1 active:cursor-grabbing"
                  {...dragHandleProps}
                  {...listeners}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              ) : null}
              <h3 className="text-sm font-semibold">{column.title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                {items.length}
              </span>
              {filterButton}
            </div>
          </div>
        ))}

      {/* Droppable & sortable area */}
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setScrollerRef}
          data-testid={`kanban-column-scroller-${column.id}`}
          className={cn(
            /* `relative` keeps absolutely positioned card content (e.g.
               `sr-only` labels) inside this scroller so it is clipped here
               rather than expanding an ancestor's scroll area. */
            'relative flex flex-1 flex-col gap-2 px-3 pb-3',
            columnOverflow === 'scroll'
              ? 'min-h-0 overflow-y-auto pr-2'
              : 'min-h-[60px] overflow-visible',
          )}
        >
          {virtualization ? (
            <KanbanVirtualColumnCards
              column={column}
              items={items}
              renderItem={renderItem}
              itemClassName={itemClassName}
              scroller={scroller}
              activeItemId={activeItemId}
              options={virtualization}
              dragDisabled={dragDisabled}
              touch={touch}
            />
          ) : (
            <KanbanColumnCards
              column={column}
              items={items}
              renderItem={renderItem}
              itemClassName={itemClassName}
              dragDisabled={dragDisabled}
              touch={touch}
            />
          )}

          {/* Outside the sortable id list on purpose — it is not a card. */}
          {infiniteScroll ? (
            <InfiniteScrollSentinel
              root={scroller}
              distance={infiniteScroll.distance}
              threshold={infiniteScroll.threshold}
              disabled={infiniteScroll.disabled}
              hasMore={infiniteScroll.hasMore(column)}
              isLoading={infiniteScroll.isLoading?.(column) ?? false}
              loadingComponent={infiniteScroll.loadingComponent}
              endMessage={infiniteScroll.endMessage}
              onLoadMore={() => infiniteScroll.onLoadMore(column)}
            />
          ) : null}
        </div>
      </SortableContext>
    </div>
  );
}
