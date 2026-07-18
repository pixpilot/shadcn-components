import type { ComponentMeta } from '@internal/mcp';
import type { CommonArrayProp } from '../array-common/array-mcp-props';
import { defineProps } from '@internal/mcp';
import { commonArrayPropDocs, perItemStylingNote } from '../array-common/array-mcp-props';

// `autoSave` is part of `CommonArrayProp`; this component overrides its doc below.
type ArrayDrawerProp = CommonArrayProp | 'drawerProps';

export const meta: ComponentMeta<ArrayDrawerProp> = {
  name: 'ArrayDrawer',
  category: 'Formily Arrays',
  description:
    'A Formily array field that renders items as a compact list; each item is edited inside a drawer opened from its row.',
  htmlElement: 'div',
  props: defineProps<ArrayDrawerProp>({
    ...commonArrayPropDocs,
    autoSave: {
      description:
        'When true, edits commit to the array live and the Save/Cancel buttons are hidden. When false (default), edits only commit on Save. Falls back to the form-level `settings.dialog.autoSave`.',
      type: 'boolean',
      defaultValue: 'false',
    },
    drawerProps:
      'Props forwarded to the edit drawer — e.g. `className` to size/scroll the drawer, `direction` (`top | bottom | left | right`, default `bottom`) to change the anchored edge, `floating` (boolean) to detach it from the viewport edges with a gap and full rounding, and vaul/Radix content handlers like `onInteractOutside`, `onEscapeKeyDown`.',
  }),
  examples: [
    {
      title: 'Edit items in a drawer',
      code: `{
  type: 'array',
  'x-component': 'ArrayDrawer',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Input' },
    },
  },
  properties: {
    addition: { type: 'void', title: 'Add', 'x-component': 'ArrayDrawer.Addition' },
  },
}`,
    },
    {
      title: 'Side drawer',
      code: `'x-component-props': {
  drawerProps: { direction: 'right' },
}`,
    },
  ],
  notes: [
    perItemStylingNote,
    'The list container is styled via the array node `x-component-props.className`; the drawer is styled via `x-component-props.drawerProps.className`.',
  ],
  keywords: ['formily', 'array', 'drawer', 'sheet', 'list', 'repeater'],
  related: ['ArrayDialog', 'ArrayPopover', 'ArrayCards', 'ArrayCollapse', 'ArrayInline'],
};
