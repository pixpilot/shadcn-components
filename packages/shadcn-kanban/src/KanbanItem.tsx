'use client';

import type { KanbanColumn, KanbanItem as KanbanItemType } from './types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';

interface KanbanItemProps<T> {
  item: KanbanItemType<T>;
  column: KanbanColumn;
  renderItem?: (item: KanbanItemType<T>, column: KanbanColumn) => React.ReactNode;
  className?: string;
  /** Freezes the drag while keeping the card rendered and interactive. */
  dragDisabled?: boolean;
}

interface KanbanItemContentProps<T> {
  item: KanbanItemType<T>;
  column: KanbanColumn;
  renderItem?: (item: KanbanItemType<T>, column: KanbanColumn) => React.ReactNode;
}

function KanbanItemContent<T>({
  item,
  column,
  renderItem,
}: KanbanItemContentProps<T>): React.ReactNode {
  return renderItem ? (
    renderItem(item, column)
  ) : (
    <span className="text-sm">{item.name}</span>
  );
}

/*
 * dnd-kit updates every sortable wrapper while measuring a drag. Keep that
 * small wrapper reactive, but avoid re-running a consumer's card renderer
 * when the item and column themselves have not changed.
 */
const MemoizedKanbanItemContent = React.memo(
  KanbanItemContent,
) as typeof KanbanItemContent;

/**
 * A single draggable item inside a Kanban column.
 * Wraps `useSortable` from `@dnd-kit/sortable`.
 */
export function KanbanItem<T = Record<string, unknown>>({
  item,
  column,
  renderItem,
  className,
  dragDisabled = false,
}: KanbanItemProps<T>) {
  const sortableData = React.useMemo(() => ({ type: 'item' as const, item }), [item]);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.id,
      data: sortableData,
      disabled: dragDisabled,
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
  };

  return (
    <div
      ref={setNodeRef}
      data-testid={`kanban-item-${item.id}`}
      style={style}
      className={cn(
        'bg-background touch-none rounded-md border p-3 shadow-sm transition-shadow',
        'hover:shadow-md',
        dragDisabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        isDragging && 'z-50 opacity-50 shadow-lg',
        className,
      )}
      {...attributes}
      {...listeners}
    >
      <MemoizedKanbanItemContent item={item} column={column} renderItem={renderItem} />
    </div>
  );
}
