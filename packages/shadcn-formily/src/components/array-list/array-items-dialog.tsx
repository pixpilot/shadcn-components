/* eslint-disable ts/no-unsafe-assignment */
import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ArrayBaseMixins, IArrayBaseProps } from '../array-base';
import { observer, useField, useFieldSchema } from '@formily/react';
import { cn } from '@internal/shadcn';
import React, { useState } from 'react';
import { getDefaultValue } from '../../utils/get-default-value';
import { ArrayBase } from '../array-base';

import { ArrayItemsEditDialog } from './array-items-edit-dialog';
import { ArrayItemsEditPopover } from './array-items-edit-popover';
import { ArrayItemsList } from './array-items-list';

type ComposedArrayItems = React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & IArrayBaseProps>
> &
  ArrayBaseMixins & {
    Item?: React.FC<
      React.HTMLAttributes<HTMLDivElement> & {
        /**
         * Custom render function for item display
         */
        render?: (item: any, index: number) => React.ReactNode;
      }
    >;
    Dialog: typeof ArrayItemsEditDialog;
    Popover: typeof ArrayItemsEditPopover;
  };

// ...existing code...

/**
 * ArrayItems component displays array items as a simple list with controls
 * Each item shows:
 * - Left: Move up/down buttons
 * - Center: Item label (Item 1, Item 2, etc.)
 * - Right: Edit and Remove buttons
 */
const ArrayItemsComponent = observer(
  (
    props: React.PropsWithChildren<
      React.HTMLAttributes<HTMLDivElement> & IArrayBaseProps
    >,
  ) => {
    const field = useField<FormilyArrayField>();
    const schema = useFieldSchema();
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

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    if (schema == null) throw new Error('Cannot find schema object');

    const handleEdit = (index: number) => {
      setEditingIndex(index);
      onEdit?.(index);
    };

    const handleCloseEdit = () => {
      setEditingIndex(null);
    };

    const handleAdd = () => {
      setIsAddingNew(true);
    };

    const handleCloseAdd = () => {
      setIsAddingNew(false);
    };

    const handleSaveNew = () => {
      // The item was already added by the dialog's validation process
      onAdd?.((field.value?.length ?? 1) - 1);
      setIsAddingNew(false);
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
            renderEditButton={() => <ArrayBase.Edit className="size-8" />}
          />

          {/* Add button - custom implementation that opens dialog first */}
          <div className="pt-2">
            <ArrayBase.Addition
              onClick={(e) => {
                e.preventDefault();
                handleAdd();
              }}
            />
          </div>

          {/* Edit Dialog for existing items */}
          {editingIndex !== null && items && (
            <ArrayItemsEditDialog
              open={editingIndex !== null}
              onClose={handleCloseEdit}
              index={editingIndex}
              schema={items as Schema}
            />
          )}

          {/* Add Dialog for new items */}
          {isAddingNew && items && (
            <ArrayItemsEditDialog
              open={isAddingNew}
              onClose={handleCloseAdd}
              index={null}
              schema={items as Schema}
              defaultValue={defaultValue}
              onSave={handleSaveNew}
            />
          )}
        </div>
      </ArrayBase>
    );
  },
);

export const ArrayItems: ComposedArrayItems = ArrayItemsComponent as any;

ArrayItems.displayName = 'ArrayItems';

ArrayItems.Item = ({
  render,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  render?: (item: any, index: number) => React.ReactNode;
}) => {
  const index = ArrayBase.useIndex?.() ?? 0;
  const record = ArrayBase.useRecord?.();

  return (
    <div
      {...props}
      className={cn(
        'border-input bg-card flex items-center gap-2 rounded-md border p-3',
        className,
      )}
    >
      {render ? render(record, index) : children}
    </div>
  );
};

ArrayBase.mixin(ArrayItems);

// Add Dialog and Popover as nested components
ArrayItems.Dialog = ArrayItemsEditDialog;
ArrayItems.Popover = ArrayItemsEditPopover;

export default ArrayItems;
