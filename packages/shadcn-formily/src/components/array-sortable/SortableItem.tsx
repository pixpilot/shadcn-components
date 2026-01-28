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

interface SortableItemContextValue {
  listeners: ReturnType<typeof useSortable>['listeners'];
  setActivatorNodeRef: ReturnType<typeof useSortable>['setActivatorNodeRef'];
  attributes: ReturnType<typeof useSortable>['attributes'];
  isDragging: boolean;
}

const SortableItemContext = React.createContext<SortableItemContextValue | null>(null);

export function useSortableItemContext() {
  const context = React.use(SortableItemContext);
  if (context == null) {
    throw new Error('useSortableItemContext must be used within a SortableItem');
  }
  return context;
}

/**
 * Reusable sortable item wrapper component
 * Wraps any array item content to make it sortable
 */
export const SortableItem: React.FC<SortableItemProps> = ({ id, disabled, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
    // transition: null,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? OPACITY_DRAGGING : 1,
  };

  const contextValue = React.useMemo(
    () => ({
      listeners,
      setActivatorNodeRef,
      attributes,
      isDragging,
    }),
    [listeners, setActivatorNodeRef, attributes, isDragging],
  );

  return (
    <SortableItemContext value={contextValue}>
      <div
        data-slot="sortable-item"
        ref={setNodeRef as React.Ref<HTMLDivElement>}
        style={style}
        // Don't spread attributes or listeners here - they should be on the drag handle
      >
        {children}
      </div>
    </SortableItemContext>
  );
};

SortableItem.displayName = 'SortableItem';
