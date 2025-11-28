import type { ArrayField } from '@formily/core';
import type { JSXComponent } from '@formily/react';

import type { IArrayBaseItemProps } from './array-context';

import type { ArrayBaseMixins, IArrayBaseProps } from './types';

import { useField, useFieldSchema } from '@formily/react';
import React from 'react';
import {
  ArrayBaseContext,
  ItemContext,
  useArray,
  useIndex,
  useRecord,
} from './array-context';
import { arrayComponentMap } from './components/components';

type ComposedArrayBase = React.FC<React.PropsWithChildren<IArrayBaseProps>> &
  ArrayBaseMixins & {
    Item: React.FC<React.PropsWithChildren<IArrayBaseItemProps>>;
    mixin: <T extends JSXComponent>(target: T) => T & ArrayBaseMixins;
  };

export const ArrayBase: ComposedArrayBase = (props) => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  const contextValue = React.useMemo(
    () => ({ field, schema, props }),
    [field, schema, props],
  );
  return <ArrayBaseContext value={contextValue}>{props.children}</ArrayBaseContext>;
};

ArrayBase.Item = React.memo(({ children, ...props }) => {
  return <ItemContext value={props}>{children}</ItemContext>;
});

ArrayBase.Index = arrayComponentMap.Index;
ArrayBase.Empty = arrayComponentMap.Empty;
ArrayBase.Addition = arrayComponentMap.Addition;
ArrayBase.Remove = arrayComponentMap.Remove;
ArrayBase.MoveDown = arrayComponentMap.MoveDown;
ArrayBase.MoveUp = arrayComponentMap.MoveUp;
ArrayBase.Edit = arrayComponentMap.Edit;
ArrayBase.Copy = arrayComponentMap.Copy;
ArrayBase.Label = arrayComponentMap.Label;

ArrayBase.useArray = useArray;
ArrayBase.useIndex = useIndex;
ArrayBase.useRecord = useRecord;

ArrayBase.Edit.displayName = 'ArrayBaseEdit';

// Mixin pattern requires mutation - following Formily's API design

ArrayBase.mixin = <T extends JSXComponent>(target: T): T & ArrayBaseMixins => {
  const mixed = target as T & ArrayBaseMixins;

  Object.entries(arrayComponentMap).forEach(([key]) => {
    // eslint-disable-next-line ts/no-unsafe-member-access
    (mixed as any)[key] = ArrayBase[key as keyof ArrayBaseMixins];
  });

  mixed.useArray = ArrayBase.useArray;
  mixed.useIndex = ArrayBase.useIndex;
  mixed.useRecord = ArrayBase.useRecord;
  return mixed;
};

export default ArrayBase;
