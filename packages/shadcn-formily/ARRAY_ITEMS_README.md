# ArrayItems List Component

A list-based array field component for Formily that provides a simple UI for managing array items with controls for reordering, editing, and removing items.

## Features

- **Simple List UI**: Displays items as a clean list with "Item 1", "Item 2", etc.
- **Move Up/Down**: Buttons on the left side to reorder items
- **Edit & Remove**: Icons on the right side for editing and deleting items
- **Edit Dialog**: Modal dialog for editing item fields
- **Fully Integrated**: Works seamlessly with Formily's form state management

## Components

### ArrayBase

Core context provider and utility components for array operations. Provides:

- `ArrayBase.Addition` - Button to add new items
- `ArrayBase.Remove` - Button to remove an item
- `ArrayBase.Edit` - Button to open edit dialog
- `ArrayBase.MoveUp` - Button to move item up
- `ArrayBase.MoveDown` - Button to move item down
- `ArrayBase.Index` - Display item index (#1, #2, etc.)
- `ArrayBase.Item` - Wrapper for array items

### ArrayItems

The main list component that renders array items with controls.

### ArrayItemsEditDialog

Dialog component for editing array item fields inline.

## Usage

### Basic Example

\`\`\`tsx
import { ArrayBase, ArrayItems, createForm, Field, Form, FormItem, Input } from '@pixpilot/shadcn-formily';

function TaskList() {
const form = createForm({
initialValues: {
tasks: [
{ title: 'Task 1', description: 'Description 1' },
{ title: 'Task 2', description: 'Description 2' },
],
},
});

return (

<Form form={form}>
<Field
name="tasks"
title="Tasks"
decorator={[FormItem]}
component={[
ArrayItems,
{
children: (
<>
<Field
name="title"
title="Title"
required
decorator={[FormItem]}
component={[Input, { placeholder: 'Task title' }]}
/>
<Field
name="description"
title="Description"
decorator={[FormItem]}
component={[Input, { placeholder: 'Task description' }]}
/>
</>
),
},
]}
/>

      <ArrayBase.Addition
        title="Add Task"
        defaultValue={{ title: '', description: '' }}
      />
    </Form>

);
}
\`\`\`

### With Complex Fields

\`\`\`tsx
<Field
name="products"
component={[
ArrayItems,
{
children: (
<>
<Field name="name" decorator={[FormItem]} component={[Input]} />
<Field
name="category"
decorator={[FormItem]}
component={[Select, { options: [...] }]}
/>
<Field name="price" decorator={[FormItem]} component={[NumberInput]} />
</>
),
},
]}
/>
\`\`\`

## UI Layout

Each item in the list is displayed with:

```
[↑] [↓]    Item #1    [✏️] [🗑️]
```

- **Left**: Move up/down buttons for reordering
- **Center**: Item label showing the index
- **Right**: Edit button (opens dialog) and Remove button

## Props

### ArrayItems Props

| Prop         | Type                      | Description                          |
| ------------ | ------------------------- | ------------------------------------ |
| `onAdd`      | `(index: number) => void` | Callback when item is added          |
| `onRemove`   | `(index: number) => void` | Callback when item is removed        |
| `onMoveUp`   | `(index: number) => void` | Callback when item moves up          |
| `onMoveDown` | `(index: number) => void` | Callback when item moves down        |
| `onEdit`     | `(index: number) => void` | Callback when item edit is triggered |
| `children`   | `React.ReactNode`         | Form fields for each array item      |

### ArrayBase.Addition Props

| Prop           | Type                  | Description                      |
| -------------- | --------------------- | -------------------------------- |
| `title`        | `string`              | Button text                      |
| `method`       | `'push' \| 'unshift'` | Where to add item (end or start) |
| `defaultValue` | `any`                 | Default value for new items      |

## Storybook Examples

Run Storybook to see live examples:

\`\`\`bash
pnpm storybook
\`\`\`

Navigate to **Formily > Array Items (List)** to see:

1. **Basic List** - Simple task list with title and description
2. **Complex Fields** - Product inventory with multiple field types
3. **Empty List** - Starting with no items
4. **Simple List** - Tags with single field per item
5. **Custom Addition** - Add button at the top instead of bottom

## Styling

The component uses Tailwind CSS classes and respects your theme configuration. All components are fully styled with shadcn/ui design tokens:

- List items have hover states
- Buttons use ghost variant for minimal UI
- Edit dialog is responsive and mobile-friendly

## Technical Details

### Dependencies

- `@formily/core` - Form state management
- `@formily/react` - React integration
- `@internal/shadcn` - UI components (Button, Dialog, etc.)
- `lucide-react` - Icons

### TypeScript Support

Full TypeScript support with exported types:

- `IArrayBaseProps`
- `IArrayBaseAdditionProps`
- `IArrayBaseOperationProps`
- `IArrayBaseContext`
- `IArrayBaseItemProps`
- `ArrayBaseMixins`

## Notes

- The edit dialog automatically renders form fields based on the array item schema
- Move up/down buttons are disabled at boundaries (first/last items)
- All operations are integrated with Formily's form state
- The component follows the same patterns as Ant Design's Formily components
