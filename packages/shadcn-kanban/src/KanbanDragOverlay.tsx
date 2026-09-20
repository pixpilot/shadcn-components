'use client';

import type {
  KanbanColumn as KanbanColumnType,
  KanbanItem as KanbanItemType,
} from './types';

import { DragOverlay } from '@dnd-kit/core';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';

interface KanbanDragOverlayProps<T> {
  activeItem: KanbanItemType<T> | null;
  activeItemColumn?: KanbanColumnType;
  activeColumn?: KanbanColumnType;
  activeColumnItemCount: number;
  renderItem?: (item: KanbanItemType<T>, column: KanbanColumnType) => React.ReactNode;
  itemClassName?: string;
  columnClassName?: string;
}

/** Floating card/column preview that follows the cursor while dragging. */
export function KanbanDragOverlay<T>({
  activeItem,
  activeItemColumn,
  activeColumn,
  activeColumnItemCount,
  renderItem,
  itemClassName,
  columnClassName,
}: KanbanDragOverlayProps<T>) {
  return (
    <DragOverlay>
      {activeItem && activeItemColumn ? (
        <div
          className={cn(
            'bg-background cursor-grabbing rounded-md border p-3 shadow-lg',
            itemClassName,
          )}
        >
          {renderItem ? (
            renderItem(activeItem, activeItemColumn)
          ) : (
            <span className="text-sm">{activeItem.name}</span>
          )}
        </div>
      ) : null}

      {activeColumn ? (
        <div
          className={cn(
            'bg-muted/40 flex min-w-[250px] flex-col rounded-lg border p-3 opacity-90 shadow-lg',
            columnClassName,
          )}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold">{activeColumn.title}</h3>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {activeColumnItemCount}
            </span>
          </div>
          <div className="text-muted-foreground flex min-h-[60px] items-center justify-center text-xs">
            Dragging column…
          </div>
        </div>
      ) : null}
    </DragOverlay>
  );
}
