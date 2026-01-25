import type { Schema } from '@formily/react';

import type { ActiveItemManager } from '../array-common';
import { observer, RecursionField } from '@formily/react';

import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@pixpilot/shadcn';
import { getXComponentProps } from '../../utils';

export interface ArrayItemsEditPopoverProps {
  /**
   * The schema for the array item
   */
  schema: Schema;

  onSave: (index: number) => void;
  onCancel: (index: number) => void;
  activeItemManager: ActiveItemManager;
  /**
   * Custom trigger element. If not provided, uses Edit button
   */
  children?: React.ReactNode;
}

export const ArrayItemsEditPopover: React.FC<ArrayItemsEditPopoverProps> = observer(
  ({ schema, onSave, onCancel, children, activeItemManager }) => {
    const activeIndex = activeItemManager.activeItem;
    const isNewItem = activeItemManager.isNew;

    const open = activeIndex !== undefined;

    const handleOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
        onCancel(activeIndex as number);
      }
    };

    const handleCancelClick = () => {
      // handleCancel();
      onCancel(activeIndex as number);
    };

    const itemWrapperProps = getXComponentProps(schema);
    const { className: itemWrapperClassName, ...itemWrapperRestProps } = itemWrapperProps;

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        {children !== undefined && <PopoverTrigger asChild>{children}</PopoverTrigger>}
        <PopoverContent className="w-96" side="top">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                {isNewItem ? 'Add New Item' : `Edit Item`}
              </h4>
              <p className="text-muted-foreground text-sm">
                {isNewItem
                  ? 'Fill in the details for the new item.'
                  : 'Make changes to the item.'}
              </p>
            </div>

            {activeIndex != null && (
              <div
                {...itemWrapperRestProps}
                className={cn('space-y-4', itemWrapperClassName)}
              >
                <RecursionField schema={schema} name={activeIndex} />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onSave(activeIndex as number);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
