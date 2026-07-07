import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { IRowProps } from './Row';
import { defineProps } from '@internal/mcp';

type RowOwnProps = OwnProps<IRowProps, 'div'>;

export const meta: ComponentMeta<RowOwnProps> = {
  name: 'Row',
  category: 'Formily Layout',
  description: 'A layout wrapper for grouping Formily fields in a horizontal row.',
  htmlElement: 'div',
  props: defineProps<RowOwnProps>({}),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="row" title="Row" x-decorator="FormItem" x-component="Row" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    row: {
      type: 'string',
      title: 'Row',
      'x-decorator': 'FormItem',
      'x-component': 'Row',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'layout', 'row', 'grid'],
};
