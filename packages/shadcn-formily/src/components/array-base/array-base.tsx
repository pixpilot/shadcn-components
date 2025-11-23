/* eslint-disable ts/no-unsafe-assignment */
/* eslint-disable ts/no-unsafe-call */

import type { ArrayField } from '@formily/core';
import type { JSXComponent, Schema } from '@formily/react';
import { useField, useFieldSchema } from '@formily/react';
import { clone, isValid } from '@formily/shared';
import { Button } from '@internal/shadcn';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import React, { createContext, useContext } from 'react';

export interface IArrayBaseAdditionProps extends React.ComponentProps<typeof Button> {
  title?: string;
  method?: 'push' | 'unshift';
  defaultValue?: any;
  icon?: React.ReactNode;
}

export interface IArrayBaseOperationProps extends React.ComponentProps<typeof Button> {
  title?: string;
  index?: number;
  icon?: React.ReactNode;
}

export interface IArrayBaseContext {
  props: IArrayBaseProps;
  field: ArrayField;
  schema: Schema;
}

export interface IArrayBaseItemProps {
  index: number;
  record: ((index: number) => Record<string, any>) | Record<string, any>;
}

export interface ArrayBaseMixins {
  Addition: React.FC<React.PropsWithChildren<IArrayBaseAdditionProps>>;
  Remove: React.FC<
    React.PropsWithChildren<IArrayBaseOperationProps & { index?: number }>
  >;
  MoveUp: React.FC<
    React.PropsWithChildren<IArrayBaseOperationProps & { index?: number }>
  >;
  MoveDown: React.FC<
    React.PropsWithChildren<IArrayBaseOperationProps & { index?: number }>
  >;
  Edit: React.FC<React.PropsWithChildren<IArrayBaseOperationProps & { index?: number }>>;
  Index: React.FC;
  useArray: () => IArrayBaseContext | null;
  useIndex: (index?: number) => number | undefined;
  useRecord: (record?: number) => any;
}

export interface IArrayBaseProps {
  disabled?: boolean;
  onAdd?: (index: number) => void;
  onRemove?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onEdit?: (index: number) => void;
}

type ComposedArrayBase = React.FC<React.PropsWithChildren<IArrayBaseProps>> &
  ArrayBaseMixins & {
    Item: React.FC<React.PropsWithChildren<IArrayBaseItemProps>>;
    mixin: <T extends JSXComponent>(target: T) => T & ArrayBaseMixins;
  };

const ArrayBaseContext = createContext<IArrayBaseContext | null>(null);
const ItemContext = createContext<IArrayBaseItemProps | null>(null);

function takeRecord(val: any, index?: number): any {
  return typeof val === 'function' ? val(index) : val;
}

function useArray() {
  return useContext(ArrayBaseContext);
}

function useIndex(index?: number) {
  const ctx = useContext(ItemContext);
  return ctx ? ctx.index : index;
}

function useRecord(record?: number): any {
  const ctx = useContext(ItemContext);
  return takeRecord(ctx ? ctx.record : record, ctx?.index);
}

function getSchemaDefaultValue(schema?: Schema): any {
  if (!schema) return undefined;
  if (schema.type === 'array') return [];
  if (schema.type === 'object') return {};
  if (schema.type === 'void' && schema.properties) {
    for (const key in schema.properties) {
      if (Object.hasOwn(schema.properties, key)) {
        const value = getSchemaDefaultValue(schema.properties[key]);
        if (isValid(value)) return value;
      }
    }
  }
  return undefined;
}

function getDefaultValue(defaultValue: any, schema: Schema): any {
  if (isValid(defaultValue)) return clone(defaultValue);
  if (Array.isArray(schema?.items)) return getSchemaDefaultValue(schema.items[0]);
  return getSchemaDefaultValue(schema?.items);
}

export const ArrayBase: ComposedArrayBase = (props) => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  return (
    <ArrayBaseContext.Provider value={{ field, schema, props }}>
      {props.children}
    </ArrayBaseContext.Provider>
  );
};

ArrayBase.Item = ({ children, ...props }) => {
  return <ItemContext.Provider value={props}>{children}</ItemContext.Provider>;
};

ArrayBase.Index = (props) => {
  const index = useIndex();
  return (
    <span {...props} className="font-medium">
      #{(index ?? 0) + 1}
    </span>
  );
};

ArrayBase.Addition = (props) => {
  const self = useField();
  const array = useArray();

  if (!array) return null;
  if (array.field?.pattern !== 'editable' && array.field?.pattern !== 'disabled')
    return null;

  return (
    <Button
      type="button"
      variant="outline"
      {...props}
      disabled={self?.disabled || array.props?.disabled}
      className={props.className}
      onClick={(e) => {
        if (array.props?.disabled) return;
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        const defaultValue = getDefaultValue(props.defaultValue, array.schema);
        if (props.method === 'unshift') {
          array.field?.unshift?.(defaultValue).catch(console.error);
          array.props?.onAdd?.(0);
        } else {
          array.field?.push?.(defaultValue).catch(console.error);
          array.props?.onAdd?.((array?.field?.value?.length ?? 1) - 1);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <PlusIcon className="mr-2 size-4" />}
      {props.title ?? props.children ?? 'Add Item'}
    </Button>
  );
};

ArrayBase.Remove = React.forwardRef<
  HTMLButtonElement,
  IArrayBaseOperationProps & { index?: number }
>((props, ref) => {
  const index = useIndex(props.index);
  const self = useField();
  const array = useArray();

  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      {...props}
      disabled={self?.disabled || array.props?.disabled}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled || array.props?.disabled) return;
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index !== undefined) {
          array.field?.remove?.(index).catch(console.error);
          array.props?.onRemove?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <Trash2Icon className="size-4" />}
    </Button>
  );
});

ArrayBase.Remove.displayName = 'ArrayBaseRemove';

ArrayBase.MoveDown = React.forwardRef<
  HTMLButtonElement,
  IArrayBaseOperationProps & { index?: number }
>((props, ref) => {
  const index = useIndex(props.index);
  const self = useField();
  const array = useArray();

  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  const isLast = index === (array.field?.value?.length ?? 0) - 1;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      {...props}
      disabled={self?.disabled || array.props?.disabled || isLast}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled || array.props?.disabled || isLast) return;
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index !== undefined) {
          array.field?.moveDown?.(index).catch(console.error);
          array.props?.onMoveDown?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <ChevronDownIcon className="size-4" />}
    </Button>
  );
});

ArrayBase.MoveDown.displayName = 'ArrayBaseMoveDown';

ArrayBase.MoveUp = React.forwardRef<
  HTMLButtonElement,
  IArrayBaseOperationProps & { index?: number }
>((props, ref) => {
  const index = useIndex(props.index);
  const self = useField();
  const array = useArray();

  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  const isFirst = index === 0;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      {...props}
      disabled={self?.disabled || array.props?.disabled || isFirst}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled || array.props?.disabled || isFirst) return;
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index !== undefined) {
          array?.field?.moveUp?.(index).catch(console.error);
          array?.props?.onMoveUp?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <ChevronUpIcon className="size-4" />}
    </Button>
  );
});

ArrayBase.MoveUp.displayName = 'ArrayBaseMoveUp';

ArrayBase.Edit = React.forwardRef<
  HTMLButtonElement,
  IArrayBaseOperationProps & { index?: number }
>((props, ref) => {
  const index = useIndex(props.index);
  const self = useField();
  const array = useArray();

  if (!array) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      {...props}
      disabled={self?.disabled || array.props?.disabled}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled || array.props?.disabled) return;
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index !== undefined) {
          array.props?.onEdit?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <EditIcon className="size-4" />}
    </Button>
  );
});

ArrayBase.Edit.displayName = 'ArrayBaseEdit';

ArrayBase.useArray = useArray;
ArrayBase.useIndex = useIndex;
ArrayBase.useRecord = useRecord;

// Mixin pattern requires mutation - following Formily's API design

ArrayBase.mixin = <T extends JSXComponent>(target: T): T & ArrayBaseMixins => {
  const mixed = target as T & ArrayBaseMixins;
  mixed.Index = ArrayBase.Index;
  mixed.Addition = ArrayBase.Addition;
  mixed.Remove = ArrayBase.Remove;
  mixed.MoveDown = ArrayBase.MoveDown;
  mixed.MoveUp = ArrayBase.MoveUp;
  mixed.Edit = ArrayBase.Edit;
  mixed.useArray = ArrayBase.useArray;
  mixed.useIndex = ArrayBase.useIndex;
  mixed.useRecord = ArrayBase.useRecord;
  return mixed;
};

export default ArrayBase;
