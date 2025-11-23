/* eslint-disable ts/no-unsafe-assignment */
import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ArrayBaseMixins, IArrayBaseProps } from '../array-base';
import { observer, useField, useFieldSchema } from '@formily/react';
import { cn } from '@internal/shadcn';
import React from 'react';
import { getDefaultValue } from '../../utils/get-default-value';
import { ArrayBase } from '../array-base';

import { ArrayItemsEditPopover } from './array-items-edit-popover';
import { ArrayItemsList } from './array-items-list';

type ComposedArrayItemsPopover = React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & IArrayBaseProps>
> &
  ArrayBaseMixins;

/**
 * ArrayItemsPopover component - displays array items with Popover editing
 * Similar to ArrayItems but uses Popover instead of Dialog for inline editing
 */
const ArrayItemsPopoverComponent = observer(
  (
    props: React.PropsWithChildren<
      React.HTMLAttributes<HTMLDivElement> & IArrayBaseProps
    >,
  ) => {
    const field = useField<FormilyArrayField>();
    const schema = useFieldSchema();
    const [addingTempIndex, setAddingTempIndex] = React.useState<number | null>(null);
    const {
      onAdd,
      onRemove,
      onMoveDown,
      onMoveUp,
      onEdit,
      className,
      children,
      ...rest
    } = props;

    if (schema == null) throw new Error('Cannot find schema object');

    const handleEdit = (index: number) => {
      onEdit?.(index);
    };

    const handleSaveNew = () => {
      // The item is already in the array (added by useArrayItemEditor as a temp item)
      // Just call onAdd to notify that an item was added
      const newIndex = (field.value?.length ?? 1) - 1;
      onAdd?.(newIndex);
      setAddingTempIndex(null);
    };

    const handlePopoverOpenChange = (_isOpen: boolean, tempIndex: number | null) => {
      // Update the temp index to hide/show the item
      setAddingTempIndex(tempIndex);
    };

    const items = Array.isArray(schema.items)
      ? (schema.items[0] ?? schema.items)
      : schema.items;

    const defaultValue = getDefaultValue(undefined, schema);

    return (
      <ArrayBase
        onAdd={onAdd}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onEdit={handleEdit}
      >
        <div {...rest} className={cn('space-y-2', className)}>
          <ArrayItemsList
            tempItemIndex={addingTempIndex}
            renderEditButton={(index) =>
              items ? (
                <ArrayItemsEditPopover
                  index={index}
                  schema={items as Schema}
                  title={schema.title}
                  onOpenChange={handlePopoverOpenChange}
                >
                  <ArrayBase.Edit className="size-8" />
                </ArrayItemsEditPopover>
              ) : null
            }
          />

          {/* Add button - opens popover for new items */}
          <div className="pt-2">
            {items ? (
              <ArrayItemsEditPopover
                index={null}
                schema={items as Schema}
                defaultValue={defaultValue}
                onSave={handleSaveNew}
                title={schema.title}
                onOpenChange={handlePopoverOpenChange}
              >
                {/* Prevent Addition's default add behavior - popover handles it */}
                <ArrayBase.Addition
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                />
              </ArrayItemsEditPopover>
            ) : (
              <ArrayBase.Addition />
            )}
          </div>
        </div>
      </ArrayBase>
    );
  },
);

export const ArrayItemsPopover: ComposedArrayItemsPopover =
  ArrayItemsPopoverComponent as any;

ArrayItemsPopover.displayName = 'ArrayItemsPopover';

ArrayBase.mixin(ArrayItemsPopover);

export default ArrayItemsPopover;
