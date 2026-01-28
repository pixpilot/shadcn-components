import { Button } from '@pixpilot/shadcn-ui';
import { GripVerticalIcon } from 'lucide-react';
import React from 'react';
import { useSortableItemContext } from './SortableItem';

export interface DragHandleProps {
  /**
   * Whether the drag handle is disabled
   */
  disabled?: boolean;

  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Reusable drag handle component for sortable array items
 * Shows a grip icon that users can drag to reorder items
 * Must be used within a SortableItem component
 */
export const DragHandle: React.FC<DragHandleProps> = ({ disabled, className }) => {
  const { attributes, listeners, setActivatorNodeRef, isDragging } =
    useSortableItemContext();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      disabled={disabled}
      ref={setActivatorNodeRef as React.Ref<HTMLButtonElement>}
      {...attributes}
      {...listeners}
      data-slot="drag-handle"
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      <GripVerticalIcon className="size-4" />
    </Button>
  );
};

DragHandle.displayName = 'DragHandle';
