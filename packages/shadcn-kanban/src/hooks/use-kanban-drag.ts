'use client';

import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  SensorDescriptor,
  SensorOptions,
  UniqueIdentifier,
} from '@dnd-kit/core';
import type {
  KanbanChangeEvent,
  KanbanColumn,
  KanbanItem,
  KanbanTouchOptions,
} from '../types';

import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React from 'react';
import { isColumnSortableId } from '../utils/column-sortable-id';
import { kanbanKeyboardCoordinates } from '../utils/kanban-keyboard-coordinates';
import {
  DRAG_HANDLE_SELECTOR,
  TOUCH_ACTIVATION_DELAY,
  TOUCH_ACTIVATION_TOLERANCE,
} from '../utils/kanban-touch-defaults';
import { useKanbanBoardState } from './use-kanban-board-state';
import { useKanbanCardDrag } from './use-kanban-card-drag';
import { useKanbanCollisionDetection } from './use-kanban-collision-detection';
import { useKanbanColumnReorder } from './use-kanban-column-reorder';

const MOUSE_ACTIVATION_DISTANCE = 5;

/**
 * An explicit drag handle is already an unambiguous gesture, so it skips the
 * hold and picks up on contact. Only cards — which share their hit area with
 * the board's own scrolling — have to earn the drag.
 */
function isOnDragHandle(event: Event): boolean {
  const { target } = event;
  return target instanceof Element && target.closest(DRAG_HANDLE_SELECTOR) !== null;
}

interface UseKanbanDragOptions<T> {
  externalItems: KanbanItem<T>[];
  columns: KanbanColumn[];
  onChange?: (event: KanbanChangeEvent<T>) => void;
  onColumnChange?: (columns: KanbanColumn[]) => void;
  touch?: KanbanTouchOptions;
}

export interface UseKanbanDragResult<T> {
  items: KanbanItem<T>[];
  internalColumns: KanbanColumn[];
  activeId: UniqueIdentifier | null;
  isDraggingColumn: boolean;
  sensors: SensorDescriptor<SensorOptions>[];
  collisionDetection: CollisionDetection;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

/**
 * Drag-and-drop state machine for the Kanban board, following dnd-kit's
 * multiple-containers pattern. Owns the shared drag state and routes each
 * event to either the card handlers or the column reorder handler.
 */
export function useKanbanDrag<T>({
  externalItems,
  columns,
  onChange,
  onColumnChange,
  touch,
}: UseKanbanDragOptions<T>): UseKanbanDragResult<T> {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const isDragActiveRef = React.useRef(false);
  const dragStartItemsRef = React.useRef(externalItems);
  const lastOverIdRef = React.useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewColumnRef = React.useRef(false);

  const { items, itemsRef, applyItems, internalColumns, setInternalColumns } =
    useKanbanBoardState<T>({ externalItems, columns, isDragActiveRef });

  /* The flag only needs to survive the reflow that follows a column change. */
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      recentlyMovedToNewColumnRef.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [items]);

  const columnIds = React.useMemo(
    () => new Set(internalColumns.map((column) => column.id)),
    [internalColumns],
  );

  /*
   * Mouse and touch are deliberately separate sensors rather than one pointer
   * sensor: they need opposite activation rules. A mouse press can only mean
   * "drag", so a few pixels of travel is enough. A finger press is ambiguous —
   * it is just as likely the start of a swipe to the next column — so it has to
   * be held still before the board claims the gesture.
   */
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: MOUSE_ACTIVATION_DISTANCE },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: touch?.dragActivationDelay ?? TOUCH_ACTIVATION_DELAY,
        tolerance: touch?.dragActivationTolerance ?? TOUCH_ACTIVATION_TOLERANCE,
      },
      bypassActivationConstraint: ({ event }) => isOnDragHandle(event),
    }),
    useSensor(KeyboardSensor, { coordinateGetter: kanbanKeyboardCoordinates }),
  );

  const collisionDetection = useKanbanCollisionDetection<T>({
    columnIds,
    itemsRef,
    lastOverIdRef,
    recentlyMovedToNewColumnRef,
  });

  const { handleCardDragOver, handleCardDragEnd } = useKanbanCardDrag<T>({
    columnIds,
    itemsRef,
    applyItems,
    dragStartItemsRef,
    recentlyMovedToNewColumnRef,
    onChange,
  });

  const handleColumnDragEnd = useKanbanColumnReorder({
    internalColumns,
    setInternalColumns,
    onColumnChange,
  });

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      isDragActiveRef.current = true;
      dragStartItemsRef.current = itemsRef.current;
      lastOverIdRef.current = null;
      setActiveId(event.active.id);
    },
    [itemsRef],
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      isDragActiveRef.current = false;
      lastOverIdRef.current = null;
      setActiveId(null);

      if (isColumnSortableId(event.active.id)) {
        handleColumnDragEnd(event);
        return;
      }
      handleCardDragEnd(event);
    },
    [handleCardDragEnd, handleColumnDragEnd],
  );

  const handleDragCancel = React.useCallback(() => {
    isDragActiveRef.current = false;
    lastOverIdRef.current = null;
    setActiveId(null);
    applyItems(dragStartItemsRef.current);
  }, [applyItems]);

  return {
    items,
    internalColumns,
    activeId,
    isDraggingColumn: activeId != null && isColumnSortableId(activeId),
    sensors,
    collisionDetection,
    handleDragStart,
    handleDragOver: handleCardDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
