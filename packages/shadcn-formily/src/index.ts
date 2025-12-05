export const name = '@pixpilot/formily-shadcn';

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
export { Column } from './components/column';
export { Combobox } from './components/combobox';
export { DatePicker } from './components/date-picker';
export { FileUploadInline } from './components/file-upload-inline';
// Core components
export { Form } from './components/form';
export { FormGrid } from './components/form-grid';
export { FormItem } from './components/form-item';

// Input components
export { Input } from './components/input';
export { NumberInput } from './components/number-input';
export { ConnectedRadio, Radio } from './components/radio';
export { Row } from './components/row';
export { SchemaField } from './components/schema-field';
export { Select } from './components/select';
export { Separator } from './components/separator';
export { Slider } from './components/slider';
export { Switch } from './components/switch';
export { TagsInputInLine } from './components/tags-input-inline';
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
