'use client';

import type { UseKanbanPressFeedbackResult } from './hooks/use-kanban-press-feedback';
import type {
  KanbanColumn,
  KanbanItem as KanbanItemType,
  KanbanTouchOptions,
} from './types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { useKanbanPressFeedback } from './hooks/use-kanban-press-feedback';

interface KanbanItemProps<T> {
  item: KanbanItemType<T>;
  column: KanbanColumn;
  renderItem?: (item: KanbanItemType<T>, column: KanbanColumn) => React.ReactNode;
  className?: string;
  /** Freezes the drag while keeping the card rendered and interactive. */
  dragDisabled?: boolean;
  /** Hold-to-drag tuning; must match what the board gave the touch sensor. */
  touch?: KanbanTouchOptions;
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

type TouchHandlers = UseKanbanPressFeedbackResult['handlers'];
/* Taken from the hook rather than deep-imported, so a dnd-kit file move
   cannot break the build. */
type SortableListeners = ReturnType<typeof useSortable>['listeners'];

/** Runs the sortable's own touch listener first, then the feedback one. */
function chainTouchHandlers(
  listeners: SortableListeners,
  pressHandlers: TouchHandlers,
): TouchHandlers {
  const chained = {} as TouchHandlers;

  for (const key of Object.keys(pressHandlers) as (keyof TouchHandlers)[]) {
    const existing = listeners?.[key];
    const added = pressHandlers[key];

    chained[key] = (event) => {
      existing?.(event);
      added(event);
    };
  }

  return chained;
}

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
  touch,
}: KanbanItemProps<T>) {
  const sortableData = React.useMemo(() => ({ type: 'item' as const, item }), [item]);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.id,
      data: sortableData,
      disabled: dragDisabled,
    });

  const { isPressing, handlers: pressHandlers } = useKanbanPressFeedback({
    delay: touch?.dragActivationDelay,
    tolerance: touch?.dragActivationTolerance,
    disabled: dragDisabled || touch?.pressFeedback === false,
  });

  /*
   * dnd-kit's touch sensor activates from its own `onTouchStart`, so the
   * feedback handlers have to be chained onto the sortable's listeners rather
   * than spread after them — spreading would silently replace the activator
   * and leave touch dragging dead.
   */
  const touchHandlers = React.useMemo(
    () => chainTouchHandlers(listeners, pressHandlers),
    [listeners, pressHandlers],
  );

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
  };

  return (
    <div
      ref={setNodeRef}
      data-testid={`kanban-item-${item.id}`}
      data-pressing={isPressing ? '' : undefined}
      style={style}
      className={cn(
        /* `touch-manipulation`, not `touch-none`: the card sits inside two
           scrollers the user still has to be able to reach through it — the
           column vertically and the board horizontally. The touch sensor takes
           the gesture away from the browser only once the hold has completed. */
        'bg-background touch-manipulation rounded-md border p-3 shadow-sm select-none',
        /* Stops iOS turning the hold into a text-selection callout. */
        '[-webkit-touch-callout:none]',
        'transition-[box-shadow,scale] hover:shadow-md',
        dragDisabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        /* The only signal that a hold is underway — without it a touch drag
           feels like nothing happened until it suddenly has. */
        isPressing && 'ring-primary/40 scale-[1.02] shadow-md ring-2',
        isDragging && 'z-50 opacity-50 shadow-lg',
        className,
      )}
      {...attributes}
      {...listeners}
      {...touchHandlers}
    >
      <MemoizedKanbanItemContent item={item} column={column} renderItem={renderItem} />
    </div>
  );
}
