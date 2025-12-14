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

import { DEFAULT_OPERATIONS } from '../array-base/constants';
import ArrayItem from './item';

const ArrayCardsBase: React.FC<ArrayComponentProps> = observer((props) => {
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();
  const {
    onAdd,
    onCopy,
    onRemove,
    onMoveDown,
    onMoveUp,
    className,
    title: titleProp,
    children,
    operations,
    ...otherProps
  } = props;

  const dataSource = Array.isArray(field.value) ? field.value : [];

  const arrayComponents = useArrayComponents();

  const { ArrayItemsContainer, AddButton } = arrayComponents;

  /*
   * Render array items with their operation components
   * Following Formily pattern: let schema structure determine component placement
   */
  const renderItems = () => {
    return dataSource.map((_item, index) => {
      const { itemKey, record } = getArrayItemInfo(field, index);
      return <ArrayItem key={itemKey} index={index} title={titleProp} record={record} />;
    });
  };

  const fieldAddress = field.address.toString();

  return (
    <ArrayBase
      onAdd={onAdd}
      onCopy={onCopy}
      onRemove={onRemove}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      <ArrayItemsContainer
        {...otherProps}
        basePath={fieldAddress}
        schema={schema}
        hasItems={dataSource.length > 0}
      >
        {renderItems()}
        <AddButton schema={schema} />
      </ArrayItemsContainer>
    </ArrayBase>
  );
});

function ArrayCardsComponent(props: ArrayComponentProps) {
  const { operations: allowDefaultOperations = DEFAULT_OPERATIONS } = props;
  return (
    <ArrayComponentProvider allowedOperationsComponentNames={allowDefaultOperations}>
      <ArrayCardsBase {...props} />
    </ArrayComponentProvider>
  );
}

ArrayCardsComponent.displayName = 'ArrayCards';

export const ArrayCards: ComposedArrayProps = ArrayCardsComponent as any;

// Use ArrayBase.mixin to add all the base methods (Addition, Remove, MoveUp, MoveDown, etc.)
ArrayBase.mixin(ArrayCards);

export default ArrayCards;
