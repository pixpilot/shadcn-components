import type { ComponentMeta } from '@internal/mcp';
import type { CommonArrayProp } from '../array-common/array-mcp-props';
import { defineProps } from '@internal/mcp';
import { commonArrayPropDocs, perItemStylingNote } from '../array-common/array-mcp-props';

type ArrayInlineProp = CommonArrayProp;

export const meta: ComponentMeta<ArrayInlineProp> = {
  name: 'ArrayInline',
  category: 'Formily Arrays',
  description:
    'A Formily array field that renders each item as a single inline row of fields with a drag handle and per-item operations.',
  htmlElement: 'div',
  props: defineProps<ArrayInlineProp>({
    ...commonArrayPropDocs,
  }),
  examples: [
    {
      title: 'Inline rows',
      code: `{
  type: 'array',
  'x-component': 'ArrayInline',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Input' },
      qty: { type: 'number', 'x-decorator': 'FormItem', 'x-component': 'NumberInput' },
    },
  },
  properties: {
    addition: { type: 'void', title: 'Add', 'x-component': 'ArrayInline.Addition' },
  },
}`,
    },
  ],
  notes: [perItemStylingNote],
  keywords: ['formily', 'array', 'inline', 'row', 'list', 'repeater'],
  related: ['ArrayCards', 'ArrayCollapse', 'ArrayDialog', 'ArrayPopover'],
};
