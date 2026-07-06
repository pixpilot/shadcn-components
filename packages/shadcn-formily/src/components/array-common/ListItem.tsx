import { RecursionField, useFieldSchema } from '@formily/react';
import { cn, PopoverAnchor } from '@pixpilot/shadcn';
import React from 'react';
import { ArrayBase } from '../array-base';
import { SortableItem } from '../array-sortable';
import { ArrayItemHeaderRow } from './ArrayItemHeaderRow';
import { getHiddenItemSchema } from './get-hidden-item-schema';
import { ItemWrapper } from './ItemWrapper';
import { useArrayItemWrapperProps } from './use-array-item-wrapper-props';

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
  /**
   * Whether this row should act as the popover anchor.
   */
  isAnchor?: boolean;
}

/**
 * Individual list item component for array items
 * Displays an item with label and operation controls
 */
export const ListItem: React.FC<ListItemProps> = React.memo(
  ({ itemKey, index, record, isNew, isAnchor }) => {
    const schema = useFieldSchema();
    // const field = useField<ArrayField>();
    // const fieldAddress = field.address.toString();

    const hiddenItemSchema = React.useMemo(() => {
      return getHiddenItemSchema(schema.items as unknown);
    }, [schema.items]);

    // Per-item props sourced from `items['x-component-props']`, shared with all
    // other array components. className is merged; the rest is spread onto the wrapper.
    const { className: itemWrapperClassName, ...itemWrapperRest } =
      useArrayItemWrapperProps();

    const isNewItem = isNew;

    const itemContent = (
      <>
        {/* Render hidden RecursionField to create the array item field instance */}
        {hiddenItemSchema ? (
          <div style={{ display: 'none' }}>
            <RecursionField schema={hiddenItemSchema} name={index} />
          </div>
        ) : null}

        {/* Hide temporary item visually but keep it in DOM for form state */}
        <ItemWrapper
          {...itemWrapperRest}
          className={cn('px-3 pl-4 py-2', itemWrapperClassName, isNewItem && 'hidden')}
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
      </>
    );

    return (
      <ArrayBase.Item key={itemKey} index={index} record={record}>
        <SortableItem id={itemKey}>
          {isAnchor ? (
            <PopoverAnchor asChild>
              <div>{itemContent}</div>
            </PopoverAnchor>
          ) : (
            itemContent
          )}
        </SortableItem>
      </ArrayBase.Item>
    );
  },
);

ListItem.displayName = 'ListItem';
