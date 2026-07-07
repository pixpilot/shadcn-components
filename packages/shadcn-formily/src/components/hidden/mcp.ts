import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { HiddenProps } from './Hidden';
import { defineProps } from '@internal/mcp';

type HiddenOwnProps = OwnProps<HiddenProps, 'input'>;

export const meta: ComponentMeta<HiddenOwnProps> = {
  name: 'Hidden',
  category: 'Formily Utility',
  description:
    'A Formily-connected hidden field component for keeping values in the form without visible UI.',
  htmlElement: 'input',
  props: defineProps<HiddenOwnProps>({}),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="hidden" title="Hidden" x-decorator="FormItem" x-component="Hidden" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    hidden: {
      type: 'string',
      title: 'Hidden',
      'x-decorator': 'FormItem',
      'x-component': 'Hidden',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'hidden', 'field', 'value'],
};
