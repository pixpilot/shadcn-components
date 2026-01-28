import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ArrayItemProps } from '../array-base';

import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { getXComponentProps } from '../../utils';
import { ArrayBase } from '../array-base';
import { isOperationComponent } from '../array-base/utils/is-array-component';
import { ArrayDragHandle } from '../array-common/ArrayDragHandle';
import { ArrayItemOperations } from '../array-common/ArrayItemOperations';
import { useArrayItemActions } from '../array-common/use-array-item-actions';
import { SortableItem } from '../array-sortable';

export interface ArrayInlineItemProps extends ArrayItemProps {
  itemKey: string | number;
}

const ArrayInlineItem = React.memo(({ index, record, itemKey }: ArrayInlineItemProps) => {
  const schema = useFieldSchema();
  useField<FormilyArrayField>();

  const items = schema?.items as Schema;

  const itemWrapperProps = getXComponentProps(items);
  const { className: itemWrapperClassName, ...itemWrapperRestProps } = itemWrapperProps;

  const { array, actionContext, resolvedActions } = useArrayItemActions({
    index,
    stripEditAction: true,
  });

  return (
    <ArrayBase.Item index={index} record={record ?? {}}>
      <SortableItem id={itemKey}>
        <div
          {...itemWrapperRestProps}
          className={cn(
            'flex items-end gap-2 rounded-md border bg-background px-3 py-2',
            itemWrapperClassName,
          )}
        >
          <ArrayDragHandle className="-ml-1 self-center" />

          <div className="flex flex-1 flex-wrap items-end gap-3">
            <RecursionField
              schema={items}
              name={index}
              filterProperties={(s) => {
                if (isOperationComponent(s)) return false;
                return true;
              }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-1 self-center">
            <ArrayItemOperations
              schema={schema}
              index={index}
              array={array}
              actionContext={actionContext}
              resolvedActions={resolvedActions}
            />
          </div>
        </div>
      </SortableItem>
    </ArrayBase.Item>
  );
});

ArrayInlineItem.displayName = 'ArrayInlineItem';

export default ArrayInlineItem;
