import type { ArrayField } from '@formily/core';
import type { Schema } from '@formily/react';

import type { IArrayBaseProps } from './types';
import { createContext, use } from 'react';

export interface IArrayBaseContext {
  props: IArrayBaseProps;
  field: ArrayField;
  schema: Schema;
  showEditAction?: boolean;
  sortable?: boolean;
}

export interface IArrayBaseItemProps {
  index: number;
  record: ((index: number) => Record<string, any>) | Record<string, any>;
}

export const ArrayBaseContext = createContext<IArrayBaseContext | null>(null);
export const ItemContext = createContext<IArrayBaseItemProps | null>(null);

export function takeRecord(val: unknown, index?: number): any {
  // eslint-disable-next-line ts/no-unsafe-call
  return typeof val === 'function' ? val(index) : val;
}

export function useArray(): IArrayBaseContext | null {
  return use(ArrayBaseContext);
}

export function useIndex(index?: number): number | undefined {
  const ctx = use(ItemContext);
  return ctx ? ctx.index : index;
}

export function useRecord(record?: number): any {
  const ctx = use(ItemContext);
  return takeRecord(ctx ? ctx.record : record, ctx?.index);
}
export function useArrayContext(): IArrayBaseContext {
  return use(ArrayBaseContext) as IArrayBaseContext;
}
