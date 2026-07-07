import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { IColumnProps } from './Column';
import { defineProps } from '@internal/mcp';

type ColumnOwnProps = OwnProps<IColumnProps, 'div'>;

export const meta: ComponentMeta<ColumnOwnProps> = {
  name: 'Column',
  category: 'Formily Layout',
  description: 'A layout wrapper for placing Formily fields inside a responsive column.',
  htmlElement: 'div',
  props: defineProps<ColumnOwnProps>({}),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="column" title="Column" x-decorator="FormItem" x-component="Column" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    column: {
      type: 'string',
      title: 'Column',
      'x-decorator': 'FormItem',
      'x-component': 'Column',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'layout', 'column', 'grid'],
};
