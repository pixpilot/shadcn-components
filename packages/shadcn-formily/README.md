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
    <Form
      form={form}
      layout={{ density: 'comfortable' }}
      onSubmit={(values) => console.log(values)}
    >
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
  properties: {
    field1: {
      type: 'string',
      title: 'Field 1 (Span 2)',
      'x-decorator': 'FormItem',
      'x-decorator-props': { className: 'col-span-2' },
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

- `SchemaField` - Renders forms from JSON Schema

## Schema Properties

### Common x-properties

- `x-component`: Component to render (e.g., 'Input', 'Select')
- `x-decorator`: Wrapper component (typically 'FormItem')
- `x-component-props`: Props passed to the component
- `x-decorator-props`: Props passed to the decorator

## Documentation

### [Form Layout Options](./docs/form-layout-options.md)

Learn how to configure form layout and visual settings using the `FormLayoutOptions` interface:

- **Density** - Control spacing between form elements (compact, normal, comfortable, responsive)
- **Description Placement** - Configure where field descriptions appear (top, bottom, popover)
- **Label Placement** - Set label position relative to inputs (top, bottom, start, end)
- **Custom Classes** - Apply custom CSS classes to form elements

[Read the full documentation →](./docs/form-layout-options.md)

### [JSON Schema Form: Headless vs Default Pattern](./docs/json-schema-form-headless-vs-default.md)

Learn about the difference between `JsonSchemaFormRenderer` (headless) and `JsonSchemaForm` (batteries-included) components:

- **`JsonSchemaFormRenderer`** - Pure, headless component that requires you to provide all components explicitly. Ideal for custom component registries and bundle size optimization.
- **`JsonSchemaForm`** - Convenience wrapper that comes pre-loaded with all standard components (Slider, Combobox, TagsInput, etc.). Perfect for getting started quickly.

[Read the full documentation →](./docs/json-schema-form-headless-vs-default.md)

## API Reference

### createForm

Creates a form instance with reactive state management.

```tsx
const form = createForm({
  initialValues: {},
  effects: () => {},
});
```

### Form Configuration

#### useFieldNameAsLabel

The `useFieldNameAsLabel` option controls whether field names are automatically converted to labels when no explicit label is provided.

**Default Behavior:**

- **`JsonSchemaFormRenderer`** - Sets `useFieldNameAsLabel: true` by default. Field names are automatically capitalized and used as labels if no `title` is provided in the schema.
- **`Form` component** - Must be explicitly configured. Users need to set `useFieldNameAsLabel: true` in the `config` prop to enable this behavior.

**Example with JsonSchemaFormRenderer (enabled by default):**

```tsx
import { JsonSchemaFormRenderer } from '@pixpilot/formily-shadcn';

const schema = {
  type: 'object',
  properties: {
    userName: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      // No title provided - will use "User Name" as label
    },
  },
};

export function MyForm() {
  return <JsonSchemaFormRenderer schema={schema} />;
}
```

**Example with Form component (requires explicit configuration):**

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/formily-shadcn';

const form = createForm();

const schema = {
  type: 'object',
  properties: {
    userName: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      // No title provided - will use "User Name" as label only if config is set
    },
  },
};

export function MyForm() {
  return (
    <Form
      form={form}
      config={{
        label: {
          useFieldNameAsLabel: true, // Must be explicitly set
        },
      }}
    >
      <SchemaField schema={schema} />
    </Form>
  );
}
```

The label resolution priority is:

1. Explicit `label` prop (if provided and not `false`)
2. Schema `title` field
3. Field `name` capitalized (only if `useFieldNameAsLabel: true`)
4. No label
