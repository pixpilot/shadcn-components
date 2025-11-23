# Array List Components

This directory contains components for managing array fields in Formily forms.

## Components Overview

### ArrayBase

Core component providing array operations (add, remove, move up/down, edit) with context management.

### ArrayItems (Dialog-based)

Default array items component that uses a **Dialog** for editing items. Best for:

- Complex forms that need full attention
- Forms with many fields that benefit from modal overlay
- When you want to prevent interaction with the rest of the page during editing

### ArrayItemsPopover (Popover-based)

Alternative array items component that uses a **Popover** for editing items. Best for:

- Quick inline edits
- Forms with few fields
- When you want to maintain context of the surrounding UI
- Space-efficient editing experience

### ArrayItemsAccordion (Accordion-based)

Alternative array items component that uses an **Accordion** for inline editing. Best for:

- Managing many items in a compact format
- Inline editing without modals or popovers
- When you want items to expand/collapse to show details
- Keeping all items visible in the list while editing

## Usage

### Using ArrayItems (Dialog)

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/shadcn-formily';

const form = createForm({
  initialValues: {
    contacts: [{ name: 'John', email: 'john@example.com' }],
  },
});

<Form form={form}>
  <SchemaField>
    <SchemaField.Array name="contacts" x-component="ArrayItems">
      <SchemaField.Object x-component="ArrayItems.Item">
        <SchemaField.String
          name="name"
          title="Name"
          required
          x-decorator="FormItem"
          x-component="Input"
        />
        <SchemaField.String
          name="email"
          title="Email"
          required
          x-decorator="FormItem"
          x-component="Input"
        />
      </SchemaField.Object>
      <SchemaField.Void x-component="ArrayItems.Addition" title="Add Contact" />
    </SchemaField.Array>
  </SchemaField>
</Form>;
```

### Using ArrayItemsPopover (Popover)

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/shadcn-formily';

const form = createForm({
  initialValues: {
    tasks: [{ title: 'Task 1', description: 'Description' }],
  },
});

<Form form={form}>
  <SchemaField>
    <SchemaField.Array name="tasks" x-component="ArrayItemsPopover">
      <SchemaField.Object x-component="ArrayItemsPopover.Item">
        <SchemaField.String
          name="title"
          title="Title"
          required
          x-decorator="FormItem"
          x-component="Input"
        />
        <SchemaField.String
          name="description"
          title="Description"
          x-decorator="FormItem"
          x-component="Textarea"
        />
      </SchemaField.Object>
      <SchemaField.Void x-component="ArrayItemsPopover.Addition" title="Add Task" />
    </SchemaField.Array>
  </SchemaField>
</Form>;
```

### Using ArrayItemsAccordion (Accordion)

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/shadcn-formily';

const form = createForm({
  initialValues: {
    items: [{ title: 'Item 1', description: 'Description' }],
  },
});

<Form form={form}>
  <SchemaField>
    <SchemaField.Array name="items" x-component="ArrayItemsAccordion">
      <SchemaField.Object x-component="ArrayItemsAccordion.Item">
        <SchemaField.String
          name="title"
          title="Title"
          required
          x-decorator="FormItem"
          x-component="Input"
        />
        <SchemaField.String
          name="description"
          title="Description"
          x-decorator="FormItem"
          x-component="Textarea"
        />
      </SchemaField.Object>
      <SchemaField.Void x-component="ArrayItemsAccordion.Addition" title="Add Item" />
    </SchemaField.Array>
  </SchemaField>
</Form>;
```

### Using Nested Components (Advanced)

Both `ArrayItems` and `ArrayItemsPopover` expose their edit dialogs/popovers as nested components:

```tsx
import { ArrayItems, Field, Form } from '@pixpilot/shadcn-formily';

function ExampleComponent() {
  return (
    <>
      {/* Using Dialog directly */}
      <ArrayItems.Dialog index={editingIndex} schema={itemSchema} title="Edit Item">
        <button>Edit</button>
      </ArrayItems.Dialog>

      {/* Using Popover directly */}
      <ArrayItems.Popover index={editingIndex} schema={itemSchema} title="Edit Item">
        <button>Edit</button>
      </ArrayItems.Popover>
    </>
  );
}
```

## Key Differences

| Feature            | ArrayItems (Dialog)       | ArrayItemsPopover (Popover)     | ArrayItemsAccordion (Accordion) |
| ------------------ | ------------------------- | ------------------------------- | ------------------------------- |
| **Validation**     | On "Save" button click    | On popover close attempt        | Real-time as you type           |
| **Close behavior** | Always closes on Cancel/X | Won't close if validation fails | Collapse to hide content        |
| **Positioning**    | Centered overlay          | Next to trigger element         | Inline within item              |
| **Backdrop**       | Blocks interaction        | Allows interaction outside      | No backdrop                     |
| **Best for**       | Complex/large forms       | Quick/small edits               | Many items, keep context        |
| **UX Pattern**     | Modal workflow            | Inline editing                  | Expandable list                 |
| **Space Usage**    | Full screen overlay       | Floating popup                  | Compact inline                  |

## Implementation Details

### Shared Logic

Both components use the `useArrayItemEditor` hook which provides:

- Temporary item management for new items
- Validation logic
- Cancel/restore functionality
- Consistent state management

### Validation Behavior

**ArrayItems (Dialog):**

- Validates when "Save" button is clicked
- Shows validation errors inline
- Dialog remains open if validation fails
- User explicitly clicks Save or Cancel

**ArrayItemsPopover (Popover):**

- Validates automatically when user tries to close the popover
- Popover won't close if validation fails
- User sees validation errors and can fix them
- Automatically closes on successful save

## Components

### ArrayItemsEditDialog

Reusable dialog component for editing array items. Used internally by `ArrayItems`.

Props:

- `index`: The index of the item to edit (null for new items)
- `schema`: The schema defining the form structure
- `defaultValue`: Default values for new items
- `onSave`: Callback when item is saved
- `title`: Dialog title
- `children`: Trigger element

### ArrayItemsEditPopover

Reusable popover component for editing array items. Used internally by `ArrayItemsPopover`.

Props:

- `index`: The index of the item to edit (null for new items)
- `schema`: The schema defining the form structure
- `defaultValue`: Default values for new items
- `onSave`: Callback when item is saved
- `title`: Popover title
- `children`: Trigger element

## Examples

See the Storybook stories for comprehensive examples:

- `array-items-list.stories.tsx` - ArrayItems with Dialog examples
- `array-items-popover.stories.tsx` - ArrayItemsPopover with Popover examples
