import type { ComponentMeta } from '@internal/mcp';
import type { CommonArrayProp } from '../array-common/array-mcp-props';
import { defineProps } from '@internal/mcp';
import { commonArrayPropDocs, perItemStylingNote } from '../array-common/array-mcp-props';

type ArrayCardsProp = CommonArrayProp | 'cardProps';

export const meta: ComponentMeta<ArrayCardsProp> = {
  name: 'ArrayCards',
  category: 'Formily Arrays',
  description:
    'A Formily array field that renders each item as a card with an editable form inside, plus per-item operations (move, copy, remove).',
  htmlElement: 'div',
  props: defineProps<ArrayCardsProp>({
    ...commonArrayPropDocs,
    cardProps:
      'HTML attributes applied to every item card wrapper (className, style, etc.).',
  }),
  examples: [
    {
      title: 'Array of cards',
      code: `{
  type: 'array',
  'x-component': 'ArrayCards',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Input' },
    },
  },
  properties: {
    addition: { type: 'void', title: 'Add', 'x-component': 'ArrayCards.Addition' },
  },
}`,
    },
    {
      title: 'Style each item',
      code: `items: {
  type: 'object',
  'x-component-props': { className: 'border-primary' },
  properties: { /* ... */ },
}`,
    },
  ],
  notes: [perItemStylingNote],
  keywords: ['formily', 'array', 'cards', 'list', 'repeater'],
  related: ['ArrayCollapse', 'ArrayInline', 'ArrayDialog', 'ArrayPopover'],
};
