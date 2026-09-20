'use client';

import type { CollisionDetection, UniqueIdentifier } from '@dnd-kit/core';
import type { RefObject } from 'react';
import type { KanbanItem } from '../types';

import {
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import React from 'react';
import { isColumnSortableId } from '../utils/column-sortable-id';

interface UseKanbanCollisionDetectionOptions<T> {
  columnIds: ReadonlySet<string>;
  itemsRef: RefObject<KanbanItem<T>[]>;
  /** Target from the previous frame, reused when a frame finds no collision. */
  lastOverIdRef: RefObject<UniqueIdentifier | null>;
  /** Set for the frame right after a card changes column. */
  recentlyMovedToNewColumnRef: RefObject<boolean>;
}

/**
 * Collision strategy from dnd-kit's multiple-containers example: pointer hits
 * first, falling back to rectangle intersection for keyboard drags. Hovering a
 * column resolves to the closest card inside it so placement stays stable, and
 * the previous target is reused during the reflow after a column switch.
 *
 * Rect intersection is deliberately limited to drags that have no pointer.
 * It scores the dragged card's whole rect against every column, so a pointer
 * resting outside all of them — in the gap between two columns, or below a
 * short one — can pick a neighbour whose height then changes because of the
 * preview move, which flips the winner back on the next measurement. Each flip
 * moves the card again, and the resulting drag-over/measure feedback loop ends
 * in React's "Maximum update depth exceeded". Pointer drags therefore hold the
 * previous target while the pointer is over nothing at all.
 */
export function useKanbanCollisionDetection<T>(
  options: UseKanbanCollisionDetectionOptions<T>,
): CollisionDetection {
  const { columnIds, itemsRef, lastOverIdRef, recentlyMovedToNewColumnRef } = options;

  return React.useCallback<CollisionDetection>(
    (args) => {
      if (isColumnSortableId(args.active.id)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            isColumnSortableId(container.id),
          ),
        });
      }

      /*
       * The active card stays a valid target on purpose: right after a
       * cross-column move the pointer rests on the moved card, and resolving
       * to it keeps the drag stable (drag-over ignores it) instead of
       * oscillating back to a card in the column it just left.
       */
      const droppableContainers = args.droppableContainers.filter(
        (container) => !isColumnSortableId(container.id),
      );
      const pointerCollisions = pointerWithin({ ...args, droppableContainers });
      let collisions = pointerCollisions;
      if (collisions.length === 0 && args.pointerCoordinates == null) {
        collisions = rectIntersection({ ...args, droppableContainers });
      }

      let overId = getFirstCollision(collisions, 'id');
      if (overId != null) {
        if (columnIds.has(String(overId))) {
          const columnCards = droppableContainers.filter((container) => {
            if (container.id === overId) return false;
            const item = itemsRef.current.find(({ id }) => id === container.id);
            return item?.columnId === overId;
          });
          const closestCard = closestCenter({
            ...args,
            droppableContainers: columnCards,
          })[0];
          if (closestCard) overId = closestCard.id;
        }

        lastOverIdRef.current = overId;
        return [{ id: overId }];
      }

      if (recentlyMovedToNewColumnRef.current) {
        lastOverIdRef.current = args.active.id;
      }
      return lastOverIdRef.current == null ? [] : [{ id: lastOverIdRef.current }];
    },
    [columnIds, itemsRef, lastOverIdRef, recentlyMovedToNewColumnRef],
  );
}
