import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { DrawerItemProps } from './BaseDrawerItem';
import { defineProps } from '@internal/mcp';

type DrawerItemOwnProps = OwnProps<DrawerItemProps, 'div'>;

export const meta: ComponentMeta<DrawerItemOwnProps> = {
  name: 'DrawerItem',
  category: 'Formily',
  description:
    "A Formily decorator used in place of FormItem (`x-decorator: 'DrawerItem'`). It renders the field's label, description, and validation feedback like FormItem, but puts a trigger button where the input would sit and moves the field's own component into a drawer.",
  htmlElement: 'div',
  props: defineProps<DrawerItemOwnProps>({
    label: 'Label content or accessible label for the component.',
    description: 'Description content rendered with the component.',
    trigger: {
      description:
        "Props for the trigger button, e.g. `{ label: 'Write a bio' }`. Without a label it reads `Add <title>` while the field is empty and `Edit <title>` once it holds a value (`item` when the field has no title). Accepts the button's other props too (`icon`, `className`, …). An x-reaction can set this via `decoratorProps.trigger`.",
      defaultValue: '`Add <title>` / `Edit <title>`',
    },
    open: {
      description: 'Controlled open state of the drawer.',
      type: 'boolean',
    },
    defaultOpen: {
      description: 'Initial open state when uncontrolled.',
      type: 'boolean',
      defaultValue: 'false',
    },
    onOpenChange: 'Called when the drawer open state changes.',
    validateOnClose: {
      description:
        'When true (default), closing validates the field and keeps the drawer open (with a shake) while it is invalid. Set false to always close.',
      type: 'boolean',
      defaultValue: 'true',
    },
    doneLabel: {
      description:
        'Label of the button that closes the drawer. Set to `null` to hide the footer.',
      defaultValue: `'Done'`,
    },
    drawer:
      "The drawer itself: `{ title, description, direction, slots }`, e.g. `{ title: 'Notes', direction: 'right' }`. `direction` (`top | bottom | left | right`, default `bottom`) sets the anchored edge. Title and description default to the field's label and description; `slots` takes props for `content`, `header`, `title`, `description`, `body`, and `footer`.",
    slots: 'Slot props forwarded to the FormItem parts (label, description, error).',
    descriptionPlacement: 'Forwarded to the underlying FormItem.',
    requiredMark: 'Forwarded to the underlying FormItem.',
    asterisk: 'Forwarded to the underlying FormItem.',
    feedbackStatus: 'Forwarded to the underlying FormItem.',
    feedbackText: 'Forwarded to the underlying FormItem.',
  }),
  examples: [
    {
      title: 'Edit a single field in a drawer',
      code: `{
  type: 'object',
  properties: {
    age: {
      type: 'number',
      title: 'Age',
      description: 'Enter your age in years.',
      default: 25,
      'x-decorator': 'DrawerItem',
      'x-component': 'NumberInput',
    },
  },
}`,
    },
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="bio" title="Bio" x-decorator="DrawerItem" x-component="Textarea" />`,
    },
    {
      title: 'A side drawer',
      code: `{
  type: 'string',
  title: 'Bio',
  'x-decorator': 'DrawerItem',
  'x-decorator-props': {
    drawer: { direction: 'right' },
  },
  'x-component': 'Textarea',
}`,
    },
    {
      title: 'A whole object edited in one drawer',
      code: `{
  type: 'object',
  title: 'Profile',
  'x-decorator': 'DrawerItem',
  // type: 'object' resolves to ObjectContainer. Turn off its own label and
  // description — the drawer header already shows them — and use the flat
  // variant so the card chrome does not double up inside the drawer.
  'x-component-props': { variant: 'flat', label: false, description: false },
  properties: {
    firstName: { type: 'string', title: 'First Name' },
    lastName: { type: 'string', title: 'Last Name', required: true },
  },
}`,
    },
  ],
  notes: [
    'Works on an object too: decorating a `type: object` field puts its whole form in the drawer, and closing validates every field inside it, at any depth.',
    'Swap in for FormItem on any field — the field keeps its own `x-component`, so validation, x-reactions, and component props behave exactly as under FormItem.',
    'Edits commit to the form as the user types; there is no draft/Save step. The footer button closes the drawer rather than saving.',
    'Closing (Done, Escape, or outside click) validates the field first. An invalid field keeps the drawer open and shakes it.',
    'While the drawer is closed the input stays mounted in a hidden container, so component state and reactions behave as if it were always rendered.',
    'The trigger renders in an error state, and the label turns red, while the field has a validation error — the message appears under the trigger and inside the drawer.',
    'The drawer heading defaults to the field label; override with `drawer.title` / `drawer.description`.',
  ],
  keywords: ['formily', 'decorator', 'drawer', 'sheet', 'field', 'form-item'],
  related: ['FormItem', 'DialogItem', 'PopoverItem', 'ObjectContainer'],
};
