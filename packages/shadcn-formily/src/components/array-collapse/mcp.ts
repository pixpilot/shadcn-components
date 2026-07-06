import type { ComponentMeta } from '@internal/mcp';
import type { CommonArrayProp } from '../array-common/array-mcp-props';
import { defineProps } from '@internal/mcp';
import { commonArrayPropDocs, perItemStylingNote } from '../array-common/array-mcp-props';

type ArrayCollapseProp =
  | CommonArrayProp
  | 'mode'
  | 'defaultActiveKey'
  | 'collapseProps';

export const meta: ComponentMeta<ArrayCollapseProp> = {
  name: 'ArrayCollapse',
  category: 'Formily Arrays',
  description:
    'A Formily array field that renders each item as a collapsible panel with an editable form inside, plus per-item operations.',
  htmlElement: 'div',
  props: defineProps<ArrayCollapseProp>({
    ...commonArrayPropDocs,
    mode: {
      description:
        'Panel behavior: "multiple" allows several open panels, "accordion" keeps only one open at a time.',
      type: `'accordion' | 'multiple'`,
      defaultValue: `'multiple'`,
    },
    defaultActiveKey: 'Indices of the panels that are expanded by default.',
    collapseProps: 'HTML attributes applied to every item panel wrapper (className, style, etc.).',
  }),
  examples: [
    {
      title: 'Accordion of items',
      code: `{
  type: 'array',
  'x-component': 'ArrayCollapse',
  'x-component-props': { mode: 'accordion' },
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Input' },
    },
  },
  properties: {
    addition: { type: 'void', title: 'Add', 'x-component': 'ArrayCollapse.Addition' },
  },
}`,
    },
  ],
  notes: [perItemStylingNote],
  keywords: ['formily', 'array', 'collapse', 'accordion', 'list', 'repeater'],
  related: ['ArrayCards', 'ArrayInline', 'ArrayDialog', 'ArrayPopover'],
};
