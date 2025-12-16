# Form Layout Options

The `FormLayoutOptions` interface provides a centralized way to configure visual and layout-related settings for your forms. Instead of passing individual layout props, you can group them under a single `layout` prop.

## Overview

`FormLayoutOptions` groups all visual and layout-related settings that affect how form elements are displayed and spaced. This makes form configuration more organized and easier to maintain.

## Interface Definition

```typescript
interface FormLayoutOptions {
  /** Form density - affects spacing between elements */
  density?: 'compact' | 'normal' | 'comfortable' | 'responsive';
  /** Default description placement for FormItem decorators */
  descriptionPlacement?: 'top' | 'bottom' | 'popover';
  /** Default label placement for FormItem decorators */
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
  /** Custom class names for FormItem elements */
  itemProps?: {
    classes?: {
      label?: string;
      description?: string;
      inputWrapper?: string;
      errorMessage?: string;
    };
  };
  /** Custom class names for ObjectContainer elements */
  objectContainer?: {
    classes?: {
      card?: string;
      header?: string;
      title?: string;
      description?: string;
      content?: string;
    };
  };
}
```

## Usage

### Basic Example

```tsx
import { createForm, Form } from '@pixpilot/formily-shadcn';

const form = createForm();

export function MyForm() {
  return (
    <Form
      form={form}
      layout={{
        density: 'comfortable',
        descriptionPlacement: 'bottom',
      }}
    >
      {/* Form fields */}
    </Form>
  );
}
```

### With JSON Schema Form

```tsx
import { JsonSchemaForm } from '@pixpilot/formily-shadcn';

const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      description: 'Your unique username',
    },
    email: {
      type: 'string',
      title: 'Email',
    },
  },
};

export function MyJsonSchemaForm() {
  return (
    <JsonSchemaForm
      schema={schema}
      layout={{
        density: 'responsive',
        descriptionPlacement: 'popover',
      }}
    />
  );
}
```

## Layout Options Explained

### Density

Controls the spacing between form elements. Choose the density that best fits your use case:

- **`compact`**: Minimal spacing, ideal for dense information displays or limited screen space
- **`normal`**: Balanced spacing, recommended for most use cases (default)
- **`comfortable`**: Generous spacing, ideal for improved readability and accessibility
- **`responsive`**: Automatically adjusts based on screen size - compact on mobile, normal on tablet, comfortable on desktop

```tsx
import { Form } from '@pixpilot/formily-shadcn';

<Form form={form} layout={{ density: 'comfortable' }}>
  {/* Form content */}
</Form>;
```

### Description Placement

Determines where field descriptions appear relative to the input:

- **`top`**: Description appears above the input field
- **`bottom`**: Description appears below the input field (default)
- **`popover`**: Description appears in a popover when hovering over a help icon

```tsx
import { Form } from '@pixpilot/formily-shadcn';

<Form form={form} layout={{ descriptionPlacement: 'popover' }}>
  {/* Form content */}
</Form>;
```

**Note**: Individual fields can override the form-level setting using `x-decorator-props`:

```typescript
const schema = {
  type: 'string',
  title: 'Email',
  description: 'Your email address',
  'x-decorator': 'FormItem',
  'x-decorator-props': {
    descriptionPlacement: 'top', // Overrides form-level setting
  },
};
```

### Label Placement

Controls where labels appear relative to the input field:

- **`top`**: Label appears above the input (default for most fields)
- **`bottom`**: Label appears below the input
- **`start`**: Label appears to the left of the input (inline layout)
- **`end`**: Label appears to the right of the input (inline layout, useful for checkboxes/switches)

```tsx
import { Form } from '@pixpilot/formily-shadcn';

<Form form={form} layout={{ labelPlacement: 'start' }}>
  {/* Form content */}
</Form>;
```

### Custom Class Names

Customize the appearance of form elements by providing custom CSS classes.

#### FormItem Classes

Apply custom classes to FormItem elements:

```tsx
import { Form } from '@pixpilot/formily-shadcn';

<Form
  form={form}
  layout={{
    itemProps: {
      classes: {
        label: 'font-bold text-primary',
        description: 'text-xs italic',
        inputWrapper: 'bg-gray-50',
        errorMessage: 'text-red-600 font-semibold',
      },
    },
  }}
>
  {/* Form content */}
</Form>;
```

#### ObjectContainer Classes

Apply custom classes to ObjectContainer elements (used for nested objects in schemas):

```tsx
import { Form } from '@pixpilot/formily-shadcn';

<Form
  form={form}
  layout={{
    objectContainer: {
      classes: {
        card: 'border-2 border-primary',
        header: 'bg-primary/10',
        title: 'text-xl font-bold',
        description: 'text-muted-foreground',
        content: 'p-6',
      },
    },
  }}
>
  {/* Form content */}
</Form>;
```

## Complete Example

Here's a comprehensive example combining multiple layout options:

```tsx
import { JsonSchemaForm } from '@pixpilot/formily-shadcn';

const schema = {
  type: 'object',
  properties: {
    profile: {
      type: 'object',
      title: 'User Profile',
      description: 'Personal information',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
          description: 'Your legal first name',
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          description: 'Your legal last name',
        },
        email: {
          type: 'string',
          title: 'Email',
          description: 'We will send verification emails to this address',
        },
        notifications: {
          type: 'boolean',
          title: 'Enable Notifications',
          description: 'Receive email notifications about updates',
        },
      },
    },
  },
};

export function CompleteExample() {
  return (
    <JsonSchemaForm
      schema={schema}
      layout={{
        density: 'comfortable',
        descriptionPlacement: 'bottom',
        labelPlacement: 'top',
        itemProps: {
          classes: {
            label: 'text-sm font-medium',
            description: 'text-xs text-muted-foreground',
          },
        },
        objectContainer: {
          classes: {
            card: 'border border-gray-200 shadow-sm',
            header: 'border-b pb-4',
            title: 'text-lg font-semibold',
          },
        },
      }}
      onSubmit={(values) => {
        console.log('Form submitted:', values);
      }}
    />
  );
}
```

## Best Practices

1. **Use responsive density by default**: The `responsive` density automatically adapts to different screen sizes, providing an optimal experience across devices.

2. **Consider accessibility**: Use `comfortable` density when building forms for users who may benefit from larger touch targets and more breathing room.

3. **Consistent descriptions**: Choose one description placement strategy for your entire application to maintain consistency.

4. **Override at field level when needed**: While form-level settings provide consistency, individual fields can override settings when they have special requirements.

5. **Keep customizations minimal**: Custom classes should enhance the design without fighting against the default theme. Consider using Tailwind utilities that work with the shadcn/ui design system.

## Migration from Individual Props

If you're updating existing code that used individual props like `density`, `descriptionPlacement`, etc., wrap them in the `layout` prop:

**Old approach:**

```tsx
import { Form } from '@pixpilot/formily-shadcn';

<Form
  form={form}
  density="comfortable"
  descriptionPlacement="bottom"
  itemProps={{ classes: { label: 'font-bold' } }}
/>;
```

**New approach:**

```tsx
import { Form } from '@pixpilot/formily-shadcn';

<Form
  form={form}
  layout={{
    density: 'comfortable',
    descriptionPlacement: 'bottom',
    itemProps: { classes: { label: 'font-bold' } },
  }}
/>;
```

## Related Documentation

- [JSON Schema Form: Headless vs Default](./json-schema-form-headless-vs-default.md)
- Main [README](../README.md)
