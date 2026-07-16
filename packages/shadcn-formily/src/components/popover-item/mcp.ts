import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { PopoverItemProps } from './BasePopoverItem';
import { defineProps } from '@internal/mcp';

// `popover` is added back: OwnProps drops it as a native div attribute name,
// but here it is this decorator's own prop.
type PopoverItemOwnProps = OwnProps<PopoverItemProps, 'div'> | 'popover';

export const meta: ComponentMeta<PopoverItemOwnProps> = {
  name: 'PopoverItem',
  category: 'Formily',
  description:
    "A Formily decorator used in place of FormItem (`x-decorator: 'PopoverItem'`). It renders the field's label, description, and validation feedback like FormItem, but puts a trigger button where the input would sit and moves the field's own component into a popover anchored to the button.",
  htmlElement: 'div',
  props: defineProps<PopoverItemOwnProps>({
    label: 'Label content or accessible label for the component.',
    description: 'Description content rendered with the component.',
    trigger: {
      description:
        "Props for the trigger button, e.g. `{ label: 'Write a bio' }`. Without a label it reads `Add <title>` while the field is empty and `Edit <title>` once it holds a value (`item` when the field has no title). Accepts the button's other props too (`icon`, `className`, …). An x-reaction can set this via `decoratorProps.trigger`.",
      defaultValue: '`Add <title>` / `Edit <title>`',
    },
    open: {
      description: 'Controlled open state of the popover.',
      type: 'boolean',
    },
    defaultOpen: {
      description: 'Initial open state when uncontrolled.',
      type: 'boolean',
      defaultValue: 'false',
    },
    onOpenChange: 'Called when the popover open state changes.',
    validateOnClose: {
      description:
        'When true (default), closing validates the field and keeps the popover open (with a shake) while it is invalid. Set false to always close.',
      type: 'boolean',
      defaultValue: 'true',
    },
    modal: {
      description:
        'When true, interaction outside the popover is blocked while it is open.',
      type: 'boolean',
      defaultValue: 'false',
    },
    popover:
      "The popover itself: `{ title, description, slots }`, e.g. `{ title: 'Notes', slots: { content: { className: 'w-96' } } }`. Title and description default to the field's label and description; `slots` takes props for `content`, `header`, `title`, `description`, and `body`.",
    slots: 'Slot props forwarded to the FormItem parts (label, description, error).',
    descriptionPlacement: 'Forwarded to the underlying FormItem.',
    requiredMark: 'Forwarded to the underlying FormItem.',
    asterisk: 'Forwarded to the underlying FormItem.',
    feedbackStatus: 'Forwarded to the underlying FormItem.',
    feedbackText: 'Forwarded to the underlying FormItem.',
  }),
  examples: [
    {
      title: 'Edit a single field in a popover',
      code: `{
  type: 'object',
  properties: {
    age: {
      type: 'number',
      title: 'Age',
      description: 'Enter your age in years.',
      default: 25,
      'x-decorator': 'PopoverItem',
      'x-component': 'NumberInput',
    },
  },
}`,
    },
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="bio" title="Bio" x-decorator="PopoverItem" x-component="Textarea" />`,
    },
    {
      title: 'Trigger label driven by an x-reaction',
      code: `{
  type: 'string',
  title: 'Bio',
  'x-decorator': 'PopoverItem',
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
      title: 'A whole object edited in one popover',
      code: `{
  type: 'object',
  title: 'Profile',
  'x-decorator': 'PopoverItem',
  // type: 'object' resolves to ObjectContainer. Turn off its own label and
  // description — the popover header already shows them — and use the flat
  // variant so the card chrome does not double up inside the popover.
  'x-component-props': { variant: 'flat', label: false, description: false },
  properties: {
    firstName: { type: 'string', title: 'First Name' },
    lastName: { type: 'string', title: 'Last Name', required: true },
  },
}`,
    },
  ],
  notes: [
    'Works on an object too: decorating a `type: object` field puts its whole form in the popover, and closing validates every field inside it, at any depth.',
    'Swap in for FormItem on any field — the field keeps its own `x-component`, so validation, x-reactions, and component props behave exactly as under FormItem.',
    'Edits commit to the form as the user types; there is no draft/Save step.',
    'Closing (Escape or an outside click) validates the field first. An invalid field keeps the popover open and shakes it.',
    'While the popover is closed the input stays mounted in a hidden container, so component state and reactions behave as if it were always rendered.',
    'The trigger renders in an error state, and the label turns red, while the field has a validation error — the message appears under the trigger and inside the popover.',
    'The popover content matches the trigger width by default; override with `popover.slots.content.className`.',
  ],
  keywords: ['formily', 'decorator', 'popover', 'field', 'form-item'],
  related: ['FormItem', 'DialogItem', 'ObjectContainer'],
};
