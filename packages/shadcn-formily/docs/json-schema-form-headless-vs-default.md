# JSON Schema Form: Headless vs Default Pattern

This document explains the difference between `JsonSchemaFormRenderer` (headless) and `JsonSchemaForm` (default/batteries-included) components.

## Overview

The JSON Schema Form components follow a "headless" vs "default" pattern to provide flexibility:

- **`JsonSchemaFormRenderer`** - The headless/base component that provides core functionality without any default components
- **`JsonSchemaForm`** - The default/wrapper component that comes pre-loaded with all standard form components

## JsonSchemaFormRenderer (Headless)

### What is it?

`JsonSchemaFormRenderer` is the **pure, headless version** of the JSON schema form renderer. It provides:

- Form creation and state management
- Schema transformation and validation
- Layout rendering
- **No default components** - you must provide all components explicitly

### When to use it?

Use `JsonSchemaFormRenderer` when you:

- Want complete control over which components are available
- Need to build a custom component registry from scratch
- Want to minimize bundle size by only including components you use
- Are building a highly customized form system

### Example Usage

```tsx
import { FormItem, JsonSchemaFormRenderer } from '@pixpilot/formily-shadcn';
import { Input } from '@pixpilot/shadcn-ui';

const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
};

function MyForm() {
  return (
    <JsonSchemaFormRenderer
      schema={schema}
      components={{
        fields: {
          Input: { component: Input, decorator: 'FormItem' },
        },
        decorators: {
          FormItem,
        },
      }}
    />
  );
}
```

**Important:** With `JsonSchemaFormRenderer`, if you reference a component in your schema (like `Slider`, `Combobox`, etc.) but don't provide it in the `components` prop, you'll get a validation error in development mode.

## JsonSchemaForm (Default/Batteries-Included)

### What is it?

`JsonSchemaForm` is the **default, batteries-included version** that wraps `JsonSchemaFormRenderer` and automatically provides:

- All basic components (Input, Textarea, Checkbox, etc.)
- Extended components (Slider, Combobox, TagsInput, etc.)
- All decorators (FormItem, FormGrid, etc.)

It merges the `defaultComponentRegistry` with any custom components you provide, with your custom components taking precedence.

### When to use it?

Use `JsonSchemaForm` when you:

- Want to get started quickly without worrying about component registration
- Need access to all standard form components
- Want convenience over fine-grained control
- Are building typical forms with standard components

### Example Usage

```tsx
import { JsonSchemaForm } from '@pixpilot/formily-shadcn';

const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    rating: {
      type: 'number',
      title: 'Rating',
      'x-decorator': 'FormItem',
      'x-component': 'Slider', // Slider is automatically available
    },
    tags: {
      type: 'array',
      title: 'Tags',
      'x-decorator': 'FormItem',
      'x-component': 'TagsInput', // TagsInput is automatically available
    },
  },
};

function MyForm() {
  return <JsonSchemaForm schema={schema} />;
}
```

### Available Components

`JsonSchemaForm` includes all components from `defaultComponentRegistry`:

**Basic Components:**

- Input
- Textarea
- Checkbox
- Radio
- Select
- DatePicker
- Switch
- FormItem
- FormGrid
- ArrayCards
- ArrayItems
- ArrayTable
- And more...

**Extended Components:**

- Slider
- Combobox
- TagsInput
- TagsInputInLine

### Overriding Default Components

You can still provide custom components with `JsonSchemaForm`. Your components will take precedence over the defaults:

```tsx
import { JsonSchemaForm } from '@pixpilot/formily-shadcn';
import { MyCustomInput } from './my-custom-input';

function MyForm() {
  return (
    <JsonSchemaForm
      schema={schema}
      components={{
        fields: {
          Input: { component: MyCustomInput, decorator: 'FormItem' },
          // All other default components are still available
        },
      }}
    />
  );
}
```

## Comparison

| Feature                | JsonSchemaFormRenderer         | JsonSchemaForm                   |
| ---------------------- | ------------------------------ | -------------------------------- |
| **Component Registry** | Empty by default               | Pre-loaded with all components   |
| **Bundle Size**        | Smaller (only what you import) | Larger (includes all components) |
| **Setup Complexity**   | More setup required            | Ready to use                     |
| **Flexibility**        | Maximum control                | Convenience over control         |
| **Use Case**           | Custom/minimal forms           | Standard forms                   |
| **Validation**         | Warns about missing components | All components available         |

## Getting Started

When building a form, you have two options based on your needs:

### Using JsonSchemaForm (Recommended for Most Cases)

For typical form building with all standard components available:

```tsx
import { JsonSchemaForm } from '@pixpilot/formily-shadcn';

function MyForm() {
  return (
    <JsonSchemaForm
      schema={schema}
      components={{
        fields: {
          Input: { component: MyCustomInput, decorator: 'FormItem' },
          // Override defaults as needed, others are automatically available
        },
      }}
    />
  );
}
```

### Using JsonSchemaFormRenderer (For Fine-Grained Control)

When you want to provide only specific components or build a custom component registry:

```tsx
import { FormItem, JsonSchemaFormRenderer } from '@pixpilot/formily-shadcn';
import { Checkbox, Input } from '@pixpilot/shadcn-ui';

function MyForm() {
  return (
    <JsonSchemaFormRenderer
      schema={schema}
      components={{
        fields: {
          Input: { component: Input, decorator: 'FormItem' },
          Checkbox: { component: Checkbox, decorator: 'FormItem' },
        },
        decorators: {
          FormItem,
        },
      }}
    />
  );
}
```

### Using JsonSchemaFormRenderer with All Default Components

If you want the headless version but need access to all standard components:

```tsx
import {
  defaultComponentRegistry,
  JsonSchemaFormRenderer,
} from '@pixpilot/formily-shadcn';

function MyForm() {
  return (
    <JsonSchemaFormRenderer
      schema={schema}
      components={{
        fields: defaultComponentRegistry,
        // Add or override specific components here
      }}
    />
  );
}
```

## Best Practices

1. **Start with `JsonSchemaForm`** for rapid development and convenience
2. **Switch to `JsonSchemaFormRenderer`** when you need fine-grained control or want to optimize bundle size
3. **Use TypeScript** to ensure component names in your schema match the components you've registered
4. **In development mode**, validation warnings will help you catch missing component registrations early

## Technical Details

### How JsonSchemaForm Works

`JsonSchemaForm` is implemented as a thin wrapper:

```tsx
export const JsonSchemaForm: React.FC<JsonSchemaFormRendererProps> = (props) => {
  const { components, ...rest } = props;

  // Merge defaultComponentRegistry with user-provided components
  const mergedComponents = {
    fields: {
      ...defaultComponentRegistry,
      ...(components?.fields || {}),
    },
    decorators: components?.decorators,
  };

  // eslint-disable-next-line react/jsx-no-undef
  return <JsonSchemaFormRenderer {...rest} components={mergedComponents} />;
};
```

This means:

- Zero runtime overhead beyond the initial merge
- User components always override defaults
- The actual form rendering logic is handled by `JsonSchemaFormRenderer`

### Component Registry Structure

Both components expect the same component structure:

```typescript
interface ComponentRegistry {
  fields?: Record<
    string,
    {
      component: React.ComponentType<any>;
      decorator?: string;
    }
  >;
  decorators?: Record<string, React.ComponentType<any>>;
}
```

The `defaultComponentRegistry` is exported from `@pixpilot/formily-shadcn` and can be imported for inspection or extension.
