import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { CheckboxProps } from './Checkbox';
import { defineProps } from '@internal/mcp';

type CheckboxOwnProps = OwnProps<CheckboxProps, 'button'>;

export const meta: ComponentMeta<CheckboxOwnProps> = {
  name: 'Checkbox',
  category: 'Formily Inputs',
  description:
    'A Formily-connected checkbox field that maps field value to shadcn Checkbox checked state.',
  htmlElement: 'button',
  props: defineProps<CheckboxOwnProps>({
    required: 'Marks the control as required for accessibility and UI state.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    checked: 'Controlled checked state. Usually supplied by Formily.',
    onCheckedChange: 'Controlled checked-change callback. Usually supplied by Formily.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Boolean name="enabled" title="Enabled" x-decorator="FormItem" x-component="Checkbox" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    enabled: {
      type: 'boolean',
      title: 'Enabled',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'checkbox', 'boolean', 'checked'],
};
