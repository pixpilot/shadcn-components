import { useSortable } from '@dnd-kit/sortable';
import { Button } from '@pixpilot/shadcn-ui';
import { GripVerticalIcon } from 'lucide-react';
import React from 'react';

export interface DragHandleProps {
  /**
   * ID of the sortable item
   */
  id: string | number;

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
 */
export const DragHandle: React.FC<DragHandleProps> = ({ id, disabled, className }) => {
  const { attributes, listeners, setActivatorNodeRef, isDragging } = useSortable({
    id,
  });

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
