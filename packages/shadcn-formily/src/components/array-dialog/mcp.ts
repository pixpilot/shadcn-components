import type { ComponentMeta } from '@internal/mcp';
import type { CommonArrayProp } from '../array-common/array-mcp-props';
import { defineProps } from '@internal/mcp';
import { commonArrayPropDocs, perItemStylingNote } from '../array-common/array-mcp-props';

type ArrayDialogProp = CommonArrayProp | 'autoSave' | 'dialogProps';

export const meta: ComponentMeta<ArrayDialogProp> = {
  name: 'ArrayDialog',
  category: 'Formily Arrays',
  description:
    'A Formily array field that renders items as a compact list; each item is edited inside a modal dialog opened from its row.',
  htmlElement: 'div',
  props: defineProps<ArrayDialogProp>({
    ...commonArrayPropDocs,
    autoSave: {
      description:
        'When true, edits commit to the array live and the Save/Cancel buttons are hidden. When false (default), edits only commit on Save. Falls back to the form-level `settings.dialog.autoSave`.',
      type: 'boolean',
      defaultValue: 'false',
    },
    dialogProps:
      'HTML attributes forwarded to the edit dialog content (Radix DialogContent) — e.g. `className` to size/scroll the dialog, `onInteractOutside`, `onEscapeKeyDown`.',
  }),
  examples: [
    {
      title: 'Edit items in a dialog',
      code: `{
  type: 'array',
  'x-component': 'ArrayDialog',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Input' },
    },
  },
  properties: {
    addition: { type: 'void', title: 'Add', 'x-component': 'ArrayDialog.Addition' },
  },
}`,
    },
    {
      title: 'Scrollable dialog',
      code: `'x-component-props': {
  dialogProps: { className: 'max-h-[80vh] overflow-y-auto' },
}`,
    },
  ],
  notes: [
    perItemStylingNote,
    'The list container is styled via the array node `x-component-props.className`; the dialog is styled via `x-component-props.dialogProps.className`.',
  ],
  keywords: ['formily', 'array', 'dialog', 'modal', 'list', 'repeater'],
  related: ['ArrayPopover', 'ArrayCards', 'ArrayCollapse', 'ArrayInline'],
};
