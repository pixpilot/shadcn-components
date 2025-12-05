# @pixpilot/formily-shadcn

Formily integration for shadcn/ui components. Build powerful, schema-driven forms with shadcn/ui's beautiful components and Formily's reactive form management.

## Features

- 🎨 **Shadcn/ui Integration** - Uses shadcn/ui components for consistent design
- 📝 **JSON Schema Support** - Define forms using JSON Schema
- ⚡ **Reactive State Management** - Built on @formily/reactive for optimal performance
- 🔄 **Dynamic Forms** - Support for dynamic arrays, conditional fields, and complex layouts
- 📐 **Grid Layout** - Built-in responsive grid layout with `FormGrid`
- ✅ **Validation** - Comprehensive validation with error display
- 🎯 **Type Safe** - Full TypeScript support

## Installation

```bash
pnpm add @pixpilot/formily-shadcn @formily/core @formily/react
```

## Quick Start

### Basic Form

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/formily-shadcn';

const form = createForm();

const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: 'Enter your username',
      },
    },
    email: {
      type: 'string',
      title: 'Email',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        type: 'email',
        placeholder: 'Enter your email',
      },
    },
  },
};

function MyForm() {
  return (
    <Form form={form} onSubmit={(values) => console.log(values)}>
      <SchemaField schema={schema} />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Grid Layout

```tsx
const schema = {
  type: 'void',
  'x-component': 'FormGrid',
  'x-component-props': { maxColumns: 3 },
  properties: {
    field1: {
      type: 'string',
      title: 'Field 1 (Span 2)',
      'x-decorator': 'FormItem',
      'x-decorator-props': { gridSpan: 2 },
      'x-component': 'Input',
    },
    field2: {
      type: 'string',
      title: 'Field 2',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
};
```

### Array Fields

```tsx
import {
  Field,
  ArrayField as FormilyArrayField,
  FormItem,
  Input,
} from '@pixpilot/formily-shadcn';

<FormilyArrayField name="contacts">
  {(field) => (
    <div>
      {field.value?.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <Field
            name={`contacts.${index}.name`}
            title="Name"
            decorator={[FormItem]}
            component={[Input]}
          />
          <button onClick={() => field.remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => field.push({})}>Add Contact</button>
    </div>
  )}
</FormilyArrayField>;
```

## Available Components

### Form Components

- `Form` - Main form wrapper with FormProvider
- `FormItem` - Field decorator with label, error messages
- `FormGrid` - Responsive grid layout

### Input Components

- `Input` - Text input
- `Textarea` - Multi-line text input
- `NumberInput` - Number input
- `Checkbox` - Checkbox input
- `Radio` - Radio group
- `Select` - Select dropdown

### Field Components

- `ArrayField` - Dynamic array fields
- `SchemaField` - Renders forms from JSON Schema

## Schema Properties

### Common x-properties

- `x-component`: Component to render (e.g., 'Input', 'Select')
- `x-decorator`: Wrapper component (typically 'FormItem')
- `x-component-props`: Props passed to the component
- `x-decorator-props`: Props passed to the decorator
  - `gridSpan`: Number of grid columns to span in FormGrid

## API Reference

### createForm

Creates a form instance with reactive state management.

```tsx
const form = createForm({
  initialValues: {},
  effects: () => {},
});
```

### Form Props

```tsx
interface IFormProps {
  form: IForm;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onSubmit?: (values: any) => void;
  onAutoSubmit?: (values: any) => void;
}
```

### FormGrid Props

```tsx
interface IFormGridProps {
  minColumns?: number | number[];
  maxColumns?: number | number[];
  columnGap?: number;
  rowGap?: number;
  className?: string;
}
```

## Examples

Check the `stories` directory for comprehensive examples:

- Basic forms
- Grid layouts
- Array fields
- All input types

## License

MIT
