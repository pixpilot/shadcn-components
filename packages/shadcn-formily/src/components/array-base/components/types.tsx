import type { Schema } from '@formily/react';

import type { IArrayBaseOperationProps } from '../types';
import type { IArrayBaseAdditionProps } from './addition';
import type { ArrayEmptyProps } from './empty';

export interface ArrayBaseComponents {
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
  Empty: React.FC<ArrayEmptyProps>;
  Copy: React.FC<React.PropsWithChildren<IArrayBaseOperationProps & { index?: number }>>;
  Label: React.FC;
}

export type ArrayComponentTypes = keyof ArrayBaseComponents;

export type ArrayComponentsMap = Map<ArrayComponentTypes, React.ReactNode>;

export type UserDefinedComponents = Record<ArrayComponentTypes, boolean>;

export type ArrayOperationTypes = Exclude<
  ArrayComponentTypes,
  'Addition' | 'Empty' | 'Index'
>;

export interface FieldComponentProps {
  schema: Schema;
  className?: string;
  basePath: string;
}

export interface ArrayItemComponentRegistryProps extends Pick<
  FieldComponentProps,
  'schema'
> {
  index: number;
}

export type RecursionFieldComponent = React.FC<FieldComponentProps>;
