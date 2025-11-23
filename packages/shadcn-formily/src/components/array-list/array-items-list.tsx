import type { ArrayField as FormilyArrayField } from '@formily/core';
import { useField, useForm } from '@formily/react';
import { cn } from '@internal/shadcn';
import React from 'react';
import { hasArrayItemErrors } from '../../utils/has-array-item-errors';
import { ArrayBase } from './array-base';

export interface ArrayItemsListProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Render function for the edit button/trigger
   * @param index - The index of the item
   */
  renderEditButton?: (index: number) => React.ReactNode;
  /**
   * Index of the temporary item being added (to hide from display)
   */
  tempItemIndex?: number | null;
  /**
   * Additional props to pass to the container
   */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Shared component for rendering array items list
 * Displays items with move up/down, edit, and remove controls
 */
export const ArrayItemsList: React.FC<ArrayItemsListProps> = ({
  className,
  renderEditButton,
  tempItemIndex,
  containerProps = {},
}) => {
  const field = useField<FormilyArrayField>();
  const form = useForm();
  const dataSource = Array.isArray(field.value) ? field.value : [];

  return (
    <div {...containerProps} className={cn('space-y-2', className)}>
      {dataSource.map((_item, index) => {
        // Check if this is the temporary item being added
        const isTempItem =
          tempItemIndex !== null &&
          tempItemIndex !== undefined &&
          index === tempItemIndex;

        // Check if this item has validation errors
        const hasErrors = hasArrayItemErrors(form, field, index);

        return (
          <ArrayBase.Item
            key={index}
            index={index}
            record={() => field.value?.[index] as unknown}
          >
            {/* Hide temporary item visually but keep it in DOM for form state */}
            <div
              className={cn(
                'border-input bg-card hover:bg-accent/50 flex items-center gap-2 rounded-md border p-3 transition-colors',
                isTempItem && 'hidden',
                hasErrors && 'border-destructive border-2',
              )}
            >
              {/* Left: Move up/down buttons */}
              <div className="flex flex-col gap-1">
                <ArrayBase.MoveUp className="size-7" />
                <ArrayBase.MoveDown className="size-7" />
              </div>

              {/* Center: Item label */}
              <div className="text-foreground flex-1 font-medium">
                <ArrayBase.Index />
                {' Item'}
              </div>

              {/* Right: Edit and Remove buttons */}
              <div className="flex items-center gap-1">
                {renderEditButton?.(index)}
                <ArrayBase.Remove className="size-8" />
              </div>
            </div>
          </ArrayBase.Item>
        );
      })}
    </div>
  );
};

ArrayItemsList.displayName = 'ArrayItemsList';
