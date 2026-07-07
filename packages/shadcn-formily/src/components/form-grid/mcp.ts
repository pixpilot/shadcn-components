import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { IFormGridProps } from './FormGrid';
import { defineProps } from '@internal/mcp';

type FormGridOwnProps = OwnProps<IFormGridProps, 'div'>;

export const meta: ComponentMeta<FormGridOwnProps> = {
  name: 'FormGrid',
  category: 'Formily Layout',
  description: 'A Formily layout container for arranging fields in a responsive grid.',
  htmlElement: 'div',
  props: defineProps<FormGridOwnProps>({}),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="formGrid" title="FormGrid" x-decorator="FormItem" x-component="FormGrid" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    formGrid: {
      type: 'string',
      title: 'FormGrid',
      'x-decorator': 'FormItem',
      'x-component': 'FormGrid',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'layout', 'grid'],
};
