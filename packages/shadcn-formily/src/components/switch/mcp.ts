import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { SwitchProps } from './Switch';
import { defineProps } from '@internal/mcp';

type SwitchOwnProps = OwnProps<SwitchProps, 'button'>;

export const meta: ComponentMeta<SwitchOwnProps> = {
  name: 'Switch',
  category: 'Formily Inputs',
  description: 'A Formily-connected switch field that maps field value to checked state.',
  htmlElement: 'button',
  props: defineProps<SwitchOwnProps>({
    required: 'Marks the control as required for accessibility and UI state.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    checked: 'Controlled checked state. Usually supplied by Formily.',
    onCheckedChange: 'Controlled checked-change callback. Usually supplied by Formily.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Boolean name="published" title="Published" x-decorator="FormItem" x-component="Switch" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    published: {
      type: 'boolean',
      title: 'Published',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'switch', 'boolean', 'toggle'],
};
