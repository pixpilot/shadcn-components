export const name = '@pixpilot/shadcn-formily';

export type {
  ArrayBaseMixins,
  IArrayBaseOperationProps,
  IArrayBaseProps,
} from './components/array-base';

// Array components
export { ArrayBase } from './components/array-base';

export * from './components/array-cards';
export * from './components/array-collapse';

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
