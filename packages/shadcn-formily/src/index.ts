export const name = '@pixpilot/shadcn-formily';

export { ArrayField } from './components/array-field';
export type {
  ArrayBaseMixins,
  ArrayItemsEditDialog,
  IArrayBaseAdditionProps,
  IArrayBaseContext,
  IArrayBaseItemProps,
  IArrayBaseOperationProps,
  IArrayBaseProps,
} from './components/array-list';
export { ArrayItems } from './components/array-list';

// Array components
export { ArrayBase } from './components/array-list/array-base';

export { Checkbox } from './components/checkbox';
// Core components
export { Form } from './components/form';
export { FormGrid } from './components/form-grid';
export { FormItem } from './components/form-item';

// Input components
export { Input } from './components/input';
export { NumberInput } from './components/number-input';
export { ConnectedRadio, Radio } from './components/radio';
export { SchemaField } from './components/schema-field';
export { Select } from './components/select';
export { Textarea } from './components/textarea';

// Re-export Formily core exports for convenience
export { createForm } from '@formily/core';
export type { Form as IForm } from '@formily/core';
export {
  Field,
  FormConsumer,
  FormProvider,
  ObjectField,
  VoidField,
} from '@formily/react';
export type { ISchema } from '@formily/react';
