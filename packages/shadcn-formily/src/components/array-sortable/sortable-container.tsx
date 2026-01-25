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
import { useArrayContext } from '../array-base/array-context';

export interface SortableContainerProps {
  /**
   * Array of item IDs for sorting
   */
  items: Array<string | number>;

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
  items,
  disabled,
  children,
  onSortEnd,
}) => {
  const { array } = useFormConfig();
  const field = useField<FormilyArrayField>();
  const { sortable } = useArrayContext();

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
