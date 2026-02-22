# Array Sortable & Actions

This package provides drag-and-drop sorting and customizable actions for array components in Formily.

## Features

- **Drag & Drop Sorting**: Reorder array items with a grip handle
- **Touch Support**: Works on mobile devices
- **Customizable Actions**: Add, remove, move up/down, and custom actions
- **Accessibility**: Keyboard navigation and screen reader support

## Basic Usage

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/shadcn-formily';

const form = createForm({
  values: {
    items: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
  },
});

// Render the form with sortable array
```

## Disabling Sortable

### Via Form Settings

```tsx
import { Form } from '@pixpilot/shadcn-formily';

<Form form={form} settings={{ array: { sortable: false } }}>
  {/* array content */}
</Form>;
```

### Via Component Props

```
// In schema definition
{
  type: 'array',
  'x-component': 'ArrayCards',
  'x-component-props': { sortable: false }
}
```

## Custom Actions

```
// In schema definition
{
  type: 'array',
  'x-component': 'ArrayCards',
  'x-component-props': {
    actions: ['up', 'down', 'remove']
  }
}
```

## Available Actions

- `'up'` - Move item up
- `'down'` - Move item down
- `'remove'` - Remove item
- `'copy'` - Duplicate item
- `'edit'` - Edit item (for dialogs/popovers)

## API Reference

### SortableContainer

- `field`: Formily ArrayField
- `items`: Array of item IDs
- `disabled?`: Disable sorting
- `onSortEnd?`: Callback after sorting

### DragHandle

- `id`: Unique item identifier
- `disabled?`: Disable drag handle
- `className?`: Additional CSS classes

### SortableItem

- `id`: Unique item identifier
- `disabled?`: Disable sorting for this item
- `children`: Item content</content>
