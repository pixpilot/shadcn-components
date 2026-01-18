import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ArrayItemProps } from '../array-base';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { getXComponentProps } from '../../utils';
import { ArrayBase } from '../array-base';
import { useArrayComponents } from '../array-base/component-context';
import { isOperationComponent } from '../array-base/utils/is-array-component';

const ArrayItem = React.memo(({ index, record }: ArrayItemProps) => {
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();

  const Components = useArrayComponents();

  const items = schema?.items as Schema;

  // When we render only properties (onlyRenderProperties), Formily won't mount the
  // object-level x-component wrapper, so we need to manually apply its props.
  const itemWrapperProps = getXComponentProps(items);
  const { className: itemWrapperClassName, ...itemWrapperRestProps } = itemWrapperProps;

  const fieldAddress = field.address.concat(index).toString();
  return (
    <ArrayBase.Item index={index} record={record ?? {}}>
      <div
        {...itemWrapperRestProps}
        className={cn('border rounded-lg p-4 space-y-2', itemWrapperClassName)}
      >
        <div className="flex">
          <div className="flex-1">
            <Components.ItemLabel index={index} schema={schema.items as Schema} />{' '}
          </div>
          <div>
            <Components.OperationComponents
              index={index}
              schema={schema.items as Schema}
            />
          </div>
        </div>
        <div className="space-y-4">
          <RecursionField
            basePath={fieldAddress}
            schema={items}
            name={index}
            filterProperties={(s) => {
              if (isOperationComponent(s)) return false;
              return true;
            }}
            onlyRenderProperties
          />
        </div>
      </div>
    </ArrayBase.Item>
  );
});

ArrayItem.displayName = 'ArrayItemContent';

export default ArrayItem;
