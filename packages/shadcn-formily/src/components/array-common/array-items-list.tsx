import type { ArrayField as FormilyArrayField } from '@formily/core';
import { observer, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { getArrayItemInfo } from '../../utils';
import { useArrayComponents } from '../array-base';
import { ListItem } from './list-item';

export interface ArrayItemsListProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  isNewItem?: (index: number) => boolean;
  /**
   * Additional props to pass to the container
   */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;

  children?: React.ReactNode;
}

/**
 * Shared component for rendering array items list
 * Displays items with move up/down, edit, and remove controls
 */
export const ArrayItemsList: React.FC<ArrayItemsListProps> = observer(
  ({ isNewItem, children }) => {
    const field = useField<FormilyArrayField>();
    const schema = useFieldSchema();

    const dataSource = Array.isArray(field.value) ? field.value : [];

    const { ArrayItemsContainer } = useArrayComponents();

    return (
      <ArrayItemsContainer
        schema={schema}
        basePath={field.address.toString()}
        hasItems={dataSource.length > 0}
      >
        {dataSource.map((_item, index) => {
          const { itemKey, record } = getArrayItemInfo(field, index);
          const isNew = isNewItem?.(index);
          return (
            <ListItem
              key={itemKey}
              itemKey={itemKey}
              index={index}
              record={record}
              isNew={isNew}
            />
          );
        })}
        {children}
      </ArrayItemsContainer>
    );
  },
);

ArrayItemsList.displayName = 'ArrayItemsList';
