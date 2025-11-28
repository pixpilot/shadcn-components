import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { Schema } from '@formily/react';
import type { ArrayItemProps } from '../array-base';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { ArrayBase } from '../array-base';
import { useArrayComponents } from '../array-base/component-context';
import { ArrayTitle } from '../array-base/components/title';
import { isOperationComponent } from '../array-base/utils/is-array-component';

const ArrayItem = React.memo(({ index, title, record }: ArrayItemProps) => {
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();

  const Components = useArrayComponents();

  const items = schema?.items as Schema;

  const fieldAddress = field.address.concat(index).toString();
  return (
    <ArrayBase.Item index={index} record={record ?? {}}>
      <div className=" border rounded-lg p-4 space-y-2">
        <div className="flex">
          <div className="flex-1">
            <Components.ItemLabel
              basePath={fieldAddress}
              index={index}
              schema={schema.items as Schema}
            />{' '}
            <ArrayTitle title={title ?? (field.title as string)} />
          </div>
          <div>
            <Components.OperationComponents
              basePath={fieldAddress}
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
