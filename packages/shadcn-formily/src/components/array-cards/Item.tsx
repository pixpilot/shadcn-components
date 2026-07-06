import type { Schema } from '@formily/react';
import type { ArrayItemProps } from '../array-base';
import { RecursionField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { ArrayBase } from '../array-base';
import { isOperationComponent } from '../array-base/utils/is-array-component';
import { ArrayItemHeaderRow, useArrayItemWrapperProps } from '../array-common';
import { SortableItem } from '../array-sortable';

export interface ArrayCardItemProps extends ArrayItemProps {
  /**
   * Unique key for the sortable item
   */
  itemKey: string | number;
  cardProps?: React.HTMLAttributes<HTMLDivElement>;
}

const ArrayItem = React.memo(
  ({ index, record, itemKey, cardProps }: ArrayCardItemProps) => {
    const schema = useFieldSchema();

    const items = schema?.items as Schema;

    // Per-item props sourced from `items['x-component-props']`, shared with all
    // other array components. Applied to the wrapper div.
    const { className: itemWrapperClassName, ...itemWrapperRestProps } =
      useArrayItemWrapperProps();

    return (
      <ArrayBase.Item index={index} record={record ?? {}}>
        <SortableItem id={itemKey}>
          <div
            {...itemWrapperRestProps}
            {...cardProps}
            className={cn(
              'border rounded-lg p-4 space-y-2',
              itemWrapperClassName,
              cardProps?.className,
            )}
          >
            <ArrayItemHeaderRow schema={schema.items as Schema} index={index} />
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
  },
);

ArrayItem.displayName = 'ArrayItemContent';

export default ArrayItem;
