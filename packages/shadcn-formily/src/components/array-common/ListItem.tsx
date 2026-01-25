import type { ISchema } from '@formily/react';
import { RecursionField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayBase } from '../array-base';
import { SortableItem } from '../array-sortable';
import { ArrayItemHeaderRow } from './ArrayItemHeaderRow';
import { ItemWrapper } from './ItemWrapper';

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
    // const field = useField<ArrayField>();
    // const fieldAddress = field.address.toString();

    const isNewItem = isNew;

    return (
      <ArrayBase.Item key={itemKey} index={index} record={record}>
        <SortableItem id={itemKey}>
          {/* Render hidden RecursionField to create field instances for the array item */}
          <div style={{ display: 'none' }}>
            <RecursionField schema={schema.items as ISchema} name={index} />
          </div>

          {/* Hide temporary item visually but keep it in DOM for form state */}
          <ItemWrapper
            className={cn('px-3 pl-4 py-2', isNewItem && 'hidden')}
            index={index}
          >
            <ArrayItemHeaderRow
              schema={schema}
              index={index}
              slots={{
                content: {
                  content: 'text-foreground font-medium',
                },
              }}
            />
          </ItemWrapper>
        </SortableItem>
      </ArrayBase.Item>
    );
  },
);

ListItem.displayName = 'ListItem';
