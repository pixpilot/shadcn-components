import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

export interface SortableItemProps {
  /**
   * Unique identifier for the sortable item
   */
  id: string | number;

  /**
   * Whether sorting is disabled
   */
  disabled?: boolean;

  /**
   * Children to render inside the sortable item
   */
  children: React.ReactNode;
}

const OPACITY_DRAGGING = 0.5;

/**
 * Reusable sortable item wrapper component
 * Wraps any array item content to make it sortable
 */
export const SortableItem: React.FC<SortableItemProps> = ({ id, disabled, children }) => {
  const { attributes, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
    transition: null,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? OPACITY_DRAGGING : 1,
  };

  return (
    <div
      ref={setNodeRef as React.Ref<HTMLDivElement>}
      style={style}
      {...attributes}
      // Don't spread listeners here - they should be on the drag handle
    >
      {children}
    </div>
  );
};

SortableItem.displayName = 'SortableItem';
