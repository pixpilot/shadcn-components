import type { Schema } from '@formily/react';
import type { ArrayItemProps } from '../array-base';
import { RecursionField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { getXComponentProps } from '../../utils';
import { ArrayBase } from '../array-base';
import { isOperationComponent } from '../array-base/utils/is-array-component';
import { ArrayItemHeaderRow } from '../array-common';
import { SortableItem } from '../array-sortable';

export interface ArrayCardItemProps extends ArrayItemProps {
  /**
   * Unique key for the sortable item
   */
  itemKey: string | number;
}

const ArrayItem = React.memo(({ index, record, itemKey }: ArrayCardItemProps) => {
  const schema = useFieldSchema();

  const items = schema?.items as Schema;

  // Get x-component-props from items schema to apply to the wrapper div
  // Since we're not using onlyRenderProperties, we manually extract these props
  const itemWrapperProps = getXComponentProps(items);
  const { className: itemWrapperClassName, ...itemWrapperRestProps } = itemWrapperProps;

  return (
    <ArrayBase.Item index={index} record={record ?? {}}>
      <SortableItem id={itemKey}>
        <div
          {...itemWrapperRestProps}
          className={cn('border rounded-lg p-4 space-y-2', itemWrapperClassName)}
        >
          <ArrayItemHeaderRow
            schema={schema.items as Schema}
            index={index}
            sortableId={itemKey}
          />
          <div className="space-y-4">
            <RecursionField
              schema={items}
              name={index}
              filterProperties={(s) => {
                if (isOperationComponent(s)) return false;
                return true;
              }}
            />
          </div>
        </div>
      </SortableItem>
    </ArrayBase.Item>
  );
});

ArrayItem.displayName = 'ArrayItemContent';

export default ArrayItem;
