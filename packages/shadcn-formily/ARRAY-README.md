# Array Components

This package provides powerful array field components for Formily forms with advanced editing capabilities.

## Components

- **ArrayCards** - Display array items as cards
- **ArrayCollapse** - Display array items in collapsible panels
- **ArrayDialog** - Edit array items in a modal dialog
- **ArrayPopover** - Edit array items in a popover

## Auto-Save Mode

ArrayDialog and ArrayPopover support an auto-save mode where changes are applied immediately as you type. This provides a seamless editing experience without requiring explicit save actions.

### Usage

#### Auto-Save Enabled (Immediate Changes)

Changes are applied instantly to the form state. No Save/Cancel buttons are shown.

```tsx
import { createForm, Form, SchemaField } from '@pixpilot/shadcn-formily';

const form = createForm({
  values: {
    contacts: [{ name: 'Alice', email: 'alice@example.com' }],
  },
});

<Form form={form}>
  <SchemaField>
    <SchemaField.Array
      name="contacts"
      x-component="ArrayDialog"
      x-component-props={{ autoSave: true }}
    >
      <SchemaField.Object>
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
    </SchemaField.Array>
  </SchemaField>
</Form>;
```

#### Manual Save (Default Behavior)

Changes require explicit confirmation. Save/Cancel buttons are displayed.

```tsx
import { Form, SchemaField } from '@pixpilot/shadcn-formily';

<Form form={form}>
  <SchemaField>
    <SchemaField.Array
      name="tasks"
      x-component="ArrayDialog"
      x-component-props={{ autoSave: false }}
    >
      <SchemaField.Object>
        <SchemaField.String
          name="title"
          title="Title"
          required
          x-decorator="FormItem"
          x-component="Input"
        />
      </SchemaField.Object>
    </SchemaField.Array>
  </SchemaField>
</Form>;
```

### Behavior Differences

| Feature                 | Auto-Save Mode                  | Manual Save Mode                                |
| ----------------------- | ------------------------------- | ----------------------------------------------- |
| Save Button             | Hidden                          | Visible                                         |
| Cancel Button           | Hidden                          | Visible                                         |
| Changes Applied         | Immediately on input            | On Save click only                              |
| Unsaved Changes Warning | No warning (no unsaved changes) | Dialog shakes when closing with unsaved changes |
| Validation              | Inline only                     | Inline + on Save                                |

## Example with ArrayPopover

The same auto-save behavior works with ArrayPopover:

```tsx
import { SchemaField } from '@pixpilot/shadcn-formily';

<SchemaField.Array
  name="items"
  x-component="ArrayPopover"
  x-component-props={{ autoSave: true }}
>
  <SchemaField.Object>
    <SchemaField.String
      name="label"
      title="Label"
      x-decorator="FormItem"
      x-component="Input"
    />
  </SchemaField.Object>
</SchemaField.Array>;
```

## When to Use Auto-Save

**Use auto-save when:**

- Simple, quick edits are expected
- Form validation is straightforward
- Users expect immediate feedback
- The editing experience should feel lightweight

**Use manual save when:**

- Complex multi-field forms require review before committing
- You want explicit user confirmation
- Validation is complex and should be triggered on save
- Users need the ability to discard changes easily
