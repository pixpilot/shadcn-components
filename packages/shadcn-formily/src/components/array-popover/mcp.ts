import type { ComponentMeta } from '@internal/mcp';
import type { CommonArrayProp } from '../array-common/array-mcp-props';
import { defineProps } from '@internal/mcp';
import { commonArrayPropDocs, perItemStylingNote } from '../array-common/array-mcp-props';

type ArrayPopoverProp = CommonArrayProp | 'autoSave' | 'popoverProps';

export const meta: ComponentMeta<ArrayPopoverProp> = {
  name: 'ArrayPopover',
  category: 'Formily Arrays',
  description:
    'A Formily array field that renders items as a compact list; each item is edited inside a popover anchored to its row.',
  htmlElement: 'div',
  props: defineProps<ArrayPopoverProp>({
    ...commonArrayPropDocs,
    autoSave: {
      description:
        'When true (default), edits commit to the array live and Save/Cancel are hidden. When false, edits only commit on Save. Falls back to the form-level `settings.popover.autoSave`.',
      type: 'boolean',
      defaultValue: 'true',
    },
    popoverProps:
      'HTML attributes forwarded to the edit popover content (Radix PopoverContent) — e.g. `className`, `onInteractOutside`, `onEscapeKeyDown`.',
  }),
  examples: [
    {
      title: 'Edit items in a popover',
      code: `{
  type: 'array',
  'x-component': 'ArrayPopover',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Input' },
    },
  },
  properties: {
    addition: { type: 'void', title: 'Add', 'x-component': 'ArrayPopover.Addition' },
  },
}`,
    },
  ],
  notes: [perItemStylingNote],
  keywords: ['formily', 'array', 'popover', 'list', 'repeater'],
  related: ['ArrayDialog', 'ArrayCards', 'ArrayCollapse', 'ArrayInline'],
};
