import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { DialogItemProps } from './BaseDialogItem';
import { defineProps } from '@internal/mcp';

type DialogItemOwnProps = OwnProps<DialogItemProps, 'div'>;

export const meta: ComponentMeta<DialogItemOwnProps> = {
  name: 'DialogItem',
  category: 'Formily',
  description:
    "A Formily decorator used in place of FormItem (`x-decorator: 'DialogItem'`). It renders the field's label, description, and validation feedback like FormItem, but puts a trigger button where the input would sit and moves the field's own component into a dialog.",
  htmlElement: 'div',
  props: defineProps<DialogItemOwnProps>({
    label: 'Label content or accessible label for the component.',
    description: 'Description content rendered with the component.',
    trigger: {
      description:
        "Props for the trigger button, e.g. `{ label: 'Write a bio' }`. Without a label it reads `Add <title>` while the field is empty and `Edit <title>` once it holds a value (`item` when the field has no title). Accepts the button's other props too (`icon`, `className`, …). An x-reaction can set this via `decoratorProps.trigger`.",
      defaultValue: '`Add <title>` / `Edit <title>`',
    },
    open: {
      description: 'Controlled open state of the dialog.',
      type: 'boolean',
    },
    defaultOpen: {
      description: 'Initial open state when uncontrolled.',
      type: 'boolean',
      defaultValue: 'false',
    },
    onOpenChange: 'Called when the dialog open state changes.',
    validateOnClose: {
      description:
        'When true (default), closing validates the field and keeps the dialog open (with a shake) while it is invalid. Set false to always close.',
      type: 'boolean',
      defaultValue: 'true',
    },
    doneLabel: {
      description:
        'Label of the button that closes the dialog. Set to `null` to hide the footer.',
      defaultValue: `'Done'`,
    },
    dialog:
      "The dialog itself: `{ title, description, slots }`, e.g. `{ title: 'Notes', slots: { content: { className: 'w-2xl' } } }`. Title and description default to the field's label and description; `slots` takes props for `content`, `header`, `title`, `description`, `body`, and `footer`.",
    slots: 'Slot props forwarded to the FormItem parts (label, description, error).',
    descriptionPlacement: 'Forwarded to the underlying FormItem.',
    requiredMark: 'Forwarded to the underlying FormItem.',
    asterisk: 'Forwarded to the underlying FormItem.',
    feedbackStatus: 'Forwarded to the underlying FormItem.',
    feedbackText: 'Forwarded to the underlying FormItem.',
  }),
  examples: [
    {
      title: 'Edit a single field in a dialog',
      code: `{
  type: 'object',
  properties: {
    age: {
      type: 'number',
      title: 'Age',
      description: 'Enter your age in years.',
      default: 25,
      'x-decorator': 'DialogItem',
      'x-component': 'NumberInput',
    },
  },
}`,
    },
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="bio" title="Bio" x-decorator="DialogItem" x-component="Textarea" />`,
    },
    {
      title: 'Trigger label driven by an x-reaction',
      code: `{
  type: 'string',
  title: 'Bio',
  'x-decorator': 'DialogItem',
  'x-component': 'Textarea',
  // Decorator props come from decoratorProps, not componentProps.
  'x-reactions': {
    fulfill: {
      state: {
        decoratorProps: {
          trigger: {
            label: "{{$self.value ? 'Edit bio' : 'Write a bio'}}",
          },
        },
      },
    },
  },
}`,
    },
    {
      title: 'A whole object edited in one dialog',
      code: `{
  type: 'object',
  title: 'Profile',
  'x-decorator': 'DialogItem',
  // type: 'object' resolves to ObjectContainer. Turn off its own label and
  // description — the dialog header already shows them — and use the flat
  // variant so the card chrome does not double up inside the dialog.
  'x-component-props': { variant: 'flat', label: false, description: false },
  properties: {
    firstName: { type: 'string', title: 'First Name' },
    lastName: { type: 'string', title: 'Last Name', required: true },
  },
}`,
    },
  ],
  notes: [
    'Works on an object too: decorating a `type: object` field puts its whole form in the dialog, and closing validates every field inside it, at any depth.',
    'Swap in for FormItem on any field — the field keeps its own `x-component`, so validation, x-reactions, and component props behave exactly as under FormItem.',
    'Edits commit to the form as the user types; there is no draft/Save step. The footer button closes the dialog rather than saving.',
    'Closing (Done, Escape, outside click, or the X) validates the field first. An invalid field keeps the dialog open and shakes it.',
    'While the dialog is closed the input stays mounted in a hidden container, so component state and reactions behave as if it were always rendered.',
    'The trigger renders in an error state, and the label turns red, while the field has a validation error — the message appears under the trigger and inside the dialog.',
    'The dialog heading defaults to the field label; override with `dialog.title` / `dialog.description`.',
  ],
  keywords: ['formily', 'decorator', 'dialog', 'modal', 'field', 'form-item'],
  related: ['FormItem', 'PopoverItem', 'ObjectContainer'],
};
