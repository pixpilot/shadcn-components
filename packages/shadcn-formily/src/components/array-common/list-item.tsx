import type { ArrayField } from '@formily/core';
import { useField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayBase, useArrayComponents } from '../array-base';
import { ItemWrapper } from './item-wrapper';

export interface ListItemProps {
  /**
   * Unique key for the item
   */
  itemKey: string | number;
  /**
   * Index of the item in the array
   */
  index: number;
  /**
   * Record data for the item
   */
  record: ((index: number) => Record<string, any>) | Record<string, any>;
  /**
   * Whether this is a temporary item being added
   */
  isNew?: boolean;
}

/**
 * Individual list item component for array items
 * Displays an item with label and operation controls
 */
export const ListItem: React.FC<ListItemProps> = React.memo(
  ({ itemKey, index, record, isNew }) => {
    const schema = useFieldSchema();
    const field = useField<ArrayField>();
    const { OperationComponents, ItemLabel } = useArrayComponents();
    const fieldAddress = field.address.toString();

    const isNewItem = isNew;

    return (
      <ArrayBase.Item key={itemKey} index={index} record={record}>
        {/* Hide temporary item visually but keep it in DOM for form state */}
        <ItemWrapper
          className={cn('flex px-3 pl-4 py-2', isNewItem && 'hidden')}
          index={index}
        >
          <div className="text-foreground flex-1 font-medium">
            <ItemLabel schema={schema} basePath={fieldAddress} index={index} />
          </div>

          {/* Right: Edit and Remove buttons */}
          <div className="flex items-center gap-1">
            {/* {renderEditButton?.(index)} */}
            <OperationComponents schema={schema} basePath={fieldAddress} index={index} />
          </div>
        </ItemWrapper>
      </ArrayBase.Item>
    );
  },
);

ListItem.displayName = 'ListItem';
