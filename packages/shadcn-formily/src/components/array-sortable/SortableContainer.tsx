import type { DragEndEvent } from '@dnd-kit/core';
import type { ArrayField as FormilyArrayField } from '@formily/core';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext as DndSortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useField } from '@formily/react';
import React from 'react';
import { useFormConfig } from '../../hooks';
import { getArrayItemInfo } from '../../utils';
import { useArrayContext } from '../array-base/array-context';
import { useArrayDataSource } from '../array-common';

export interface SortableContainerProps {
  /**
   * Whether sorting is disabled
   */
  disabled?: boolean;

  /**
   * Children to render inside the sortable context
   */
  children: React.ReactNode;

  /**
   * Optional callback when sorting completes
   */
  onSortEnd?: (oldIndex: number, newIndex: number) => void;
}

const ACTIVATION_DISTANCE = 8;

/**
 * Reusable sortable container that wraps array items
 * Provides drag and drop context and handles reordering in Formily
 */
export const SortableContainer: React.FC<SortableContainerProps> = ({
  disabled,
  children,
  onSortEnd,
}) => {
  const { array } = useFormConfig();
  const field = useField<FormilyArrayField>();
  const { sortable } = useArrayContext();

  const dataSource = useArrayDataSource();

  const items = dataSource.map((_, index) => {
    const { itemKey } = getArrayItemInfo(field, index);
    return itemKey;
  });

  const isSortableEnabled = array?.sortable !== false && !disabled && sortable !== false;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: ACTIVATION_DISTANCE,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over != null && active.id !== over.id) {
        const oldIndex = items.indexOf(active.id as string | number);
        const newIndex = items.indexOf(over.id as string | number);

        if (oldIndex !== -1 && newIndex !== -1) {
          // Use Formily's move operation to reorder
          field
            .move(oldIndex, newIndex)
            .then(() => {
              onSortEnd?.(oldIndex, newIndex);
            })
            .catch(console.error);
        }
      }
    },
    [field, items, onSortEnd],
  );

  if (!isSortableEnabled) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <DndSortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </DndSortableContext>
    </DndContext>
  );
};

SortableContainer.displayName = 'SortableContainer';
