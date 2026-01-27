# ArrayTags Component

A Formily-integrated array field component for managing simple arrays of strings or numbers using a tag-based interface.

## Overview

`ArrayTags` provides a user-friendly tag input interface for managing arrays of primitive values (strings or numbers). Unlike other array field components (ArrayDialog, ArrayPopover, ArrayCollapse, ArrayCards) that are designed for complex object arrays, `ArrayTags` is specifically optimized for simple, flat arrays.

## Features

- 🏷️ **Tag-based Interface** - Visual tag display with inline editing
- ⌨️ **Keyboard Navigation** - Full keyboard support (Arrow keys, Home, End, Delete, Backspace)
- 📋 **Paste Support** - Paste comma-separated values to add multiple tags at once
- ✅ **Validation** - Custom validation function support
- 🔢 **Max Tags** - Limit the number of tags that can be added
- 🚫 **Duplicate Prevention** - Optionally prevent duplicate tags
- ✏️ **Editable Tags** - Click on tags to edit them inline
- 🎨 **Disabled/ReadOnly States** - Full support for disabled and read-only modes

## Installation

This component is part of the `@pixpilot/shadcn-formily` package. The underlying `TagsInput` component from `@pixpilot/shadcn-ui` is used internally.

```bash
pnpm add @pixpilot/shadcn-formily @pixpilot/shadcn-ui
```

## Basic Usage

### Declarative Schema

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/shadcn-formily';

const form = createForm({
  values: {
    tags: ['react', 'typescript', 'formily'],
  },
});

const schema = {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      title: 'Project Tags',
      description: 'Type and press Enter to add tags',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTags',
      'x-component-props': {
        placeholder: 'Add tags...',
      },
    },
  },
};

<Form form={form}>
  <SchemaField schema={schema} />
</Form>;
```

### JSX Component

```tsx
import { ArrayTags } from '@pixpilot/shadcn-formily';

<ArrayTags
  value={['tag1', 'tag2']}
  onChange={(newValue) => console.log(newValue)}
  placeholder="Add tags..."
  maxTags={10}
/>;
```

## Props

| Prop              | Type                                       | Default               | Description                         |
| ----------------- | ------------------------------------------ | --------------------- | ----------------------------------- |
| `value`           | `Array<string \| number>`                  | `[]`                  | Current array value                 |
| `onChange`        | `(value: Array<string \| number>) => void` | -                     | Callback when value changes         |
| `placeholder`     | `string`                                   | `'Add items...'`      | Placeholder text for input          |
| `emptyText`       | `string`                                   | `'No options found.'` | Text shown when no options match    |
| `className`       | `string`                                   | -                     | Additional CSS classes              |
| `disabled`        | `boolean`                                  | `false`               | Whether the input is disabled       |
| `readOnly`        | `boolean`                                  | `false`               | Whether the input is read-only      |
| `maxTags`         | `number`                                   | -                     | Maximum number of tags allowed      |
| `allowDuplicates` | `boolean`                                  | `false`               | Whether to allow duplicate tags     |
| `editable`        | `boolean`                                  | `false`               | Whether tags can be edited inline   |
| `delimiter`       | `string`                                   | `','`                 | Delimiter for parsing pasted values |
| `addOnPaste`      | `boolean`                                  | `true`                | Whether to add tags on paste        |
| `addOnTab`        | `boolean`                                  | `true`                | Whether to add tags on Tab key      |
| `onValidate`      | `(value: string) => boolean`               | -                     | Custom validation function          |

## Examples

### With Max Tags Limit

```tsx
const schema = {
  type: 'object',
  properties: {
    skills: {
      type: 'array',
      title: 'Skills (Max 5)',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTags',
      'x-component-props': {
        placeholder: 'Add skills...',
        maxTags: 5,
      },
    },
  },
};
```

### With Paste Support

```tsx
const schema = {
  type: 'object',
  properties: {
    keywords: {
      type: 'array',
      title: 'Keywords',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTags',
      'x-component-props': {
        placeholder: 'Add keywords...',
        addOnPaste: true,
        addOnTab: true,
        delimiter: ',',
      },
    },
  },
};
```

### With Custom Validation

```tsx
const schema = {
  type: 'object',
  properties: {
    usernames: {
      type: 'array',
      title: 'Usernames',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTags',
      'x-component-props': {
        placeholder: 'Add usernames...',
        onValidate: (value: string) => {
          // Only allow alphanumeric and underscores
          return /^\w+$/u.test(value);
        },
      },
    },
  },
};
```

### Editable Tags

```tsx
const schema = {
  type: 'object',
  properties: {
    labels: {
      type: 'array',
      title: 'Issue Labels',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTags',
      'x-component-props': {
        placeholder: 'Add labels...',
        editable: true,
      },
    },
  },
};
```

### Number Array

```tsx
const schema = {
  type: 'object',
  properties: {
    ports: {
      type: 'array',
      title: 'Port Numbers',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTags',
      'x-component-props': {
        placeholder: 'Add port numbers...',
        onValidate: (value: string) => {
          const num = Number(value);
          return !Number.isNaN(num) && num > 0 && num <= 65535;
        },
      },
    },
  },
};
```

## Keyboard Shortcuts

- **Enter** - Add new tag
- **Tab** - Add new tag (if `addOnTab` is enabled)
- **Backspace** - Remove last tag when input is empty
- **Delete** - Delete focused tag
- **Arrow Left/Right** - Navigate between tags
- **Home** - Focus first tag
- **End** - Focus input

## When to Use

Use `ArrayTags` when you need to:

- Manage simple arrays of strings or numbers
- Provide a tag-like interface for adding/removing items
- Support quick data entry with paste support
- Display items as visual tags

## When NOT to Use

Do **not** use `ArrayTags` when you need to:

- Manage arrays of complex objects with multiple fields
- Display structured data with specific layouts
- Provide in-place editing of object properties

For complex object arrays, use:

- `ArrayDialog` - Full-screen editing in a dialog
- `ArrayPopover` - Inline editing in a popover
- `ArrayCollapse` - Accordion-style editing
- `ArrayCards` - Card-based layout with inline editing

## Comparison with Other Array Components

| Component     | Use Case                    | Complexity | Layout           |
| ------------- | --------------------------- | ---------- | ---------------- |
| **ArrayTags** | Simple string/number arrays | Low        | Tag-based inline |
| ArrayDialog   | Complex object editing      | High       | Full dialog      |
| ArrayPopover  | Quick inline object editing | Medium     | Popover          |
| ArrayCollapse | Accordion-style objects     | Medium     | Accordion        |
| ArrayCards    | Card layout for objects     | Medium     | Card grid        |

## Integration with Formily

`ArrayTags` automatically integrates with Formily's reactive system:

- Automatically reads/writes field values
- Respects field disabled/readOnly states
- Triggers validation on changes
- Works with Formily's dependency tracking

## Styling

The component uses the shadcn/ui design system and can be customized using:

- CSS classes via `className` prop
- Tailwind CSS utilities
- CSS variables from your theme

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader friendly
- Focus management

## Related Components

- `TagsInputInLine` - The non-array version for single tag input
- `TagsInput` - The base UI component from @pixpilot/shadcn-ui
- Other array components: `ArrayDialog`, `ArrayPopover`, `ArrayCollapse`, `ArrayCards`
