/* eslint-disable ts/no-unsafe-assignment */
import type { ArrayField as FormilyArrayField } from '@formily/core';
import type { ArrayComponentProps, ComposedArrayProps } from '../array-base';

import { observer, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { getArrayItemInfo } from '../../utils';
import { ArrayBase } from '../array-base';
import {
  ArrayComponentProvider,
  useArrayComponents,
} from '../array-base/component-context';
import { useArrayDataSource } from '../array-common';
import { SortableContainer } from '../array-sortable';
import ArrayInlineItem from './Item';

const ArrayInlineBase: React.FC<ArrayComponentProps> = observer((props) => {
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();

  const {
    onAdd,
    onCopy,
    onRemove,
    onMoveDown,
    onMoveUp,
    onEdit,
    disabled,
    actions,
    transformActions,
    className,
    ...otherProps
  } = props;

  const dataSource = useArrayDataSource();

  const arrayComponents = useArrayComponents();
  const { ArrayItemsContainer, AddButton } = arrayComponents;

  const renderItems = () => {
    return dataSource.map((_item, index) => {
      const { itemKey, record } = getArrayItemInfo(field, index);
      return (
        <ArrayInlineItem key={itemKey} itemKey={itemKey} index={index} record={record} />
      );
    });
  };

  const fieldAddress = field.address.toString();

  return (
    <ArrayBase
      disabled={disabled}
      actions={actions}
      transformActions={transformActions}
      onAdd={onAdd}
      onCopy={onCopy}
      onRemove={onRemove}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onEdit={onEdit}
    >
      <ArrayItemsContainer
        {...otherProps}
        className={className}
        basePath={fieldAddress}
        schema={schema}
        hasItems={dataSource.length > 0}
      >
        <SortableContainer>{renderItems()}</SortableContainer>
        <AddButton schema={schema} />
      </ArrayItemsContainer>
    </ArrayBase>
  );
});

function ArrayInlineComponent(props: ArrayComponentProps) {
  return (
    <ArrayComponentProvider>
      <ArrayInlineBase {...props} />
    </ArrayComponentProvider>
  );
}

ArrayInlineComponent.displayName = 'ArrayInline';

export const ArrayInline: ComposedArrayProps = ArrayInlineComponent as any;

ArrayBase.mixin(ArrayInline);

export default ArrayInline;
