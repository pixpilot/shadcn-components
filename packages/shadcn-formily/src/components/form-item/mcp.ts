import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { FormItemProps } from './form-item-types';
import { defineProps } from '@internal/mcp';

type FormItemOwnProps = OwnProps<FormItemProps, 'div'>;

export const meta: ComponentMeta<FormItemOwnProps> = {
  name: 'FormItem',
  category: 'Formily',
  description:
    'A Formily decorator that renders label, description, feedback, and spacing around a field.',
  htmlElement: 'div',
  props: defineProps<FormItemOwnProps>({
    label: 'Label content or accessible label for the component.',
    description: 'Description content rendered with the component.',
    slots: 'Slot props for customizing internal rendered parts.',
    descriptionPlacement: 'Forwarded to the underlying UI component.',
    requiredMark: 'Forwarded to the underlying UI component.',
    asterisk: 'Forwarded to the underlying UI component.',
    feedbackStatus: 'Forwarded to the underlying UI component.',
    feedbackText: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="name" title="Name" x-decorator="FormItem" x-component="Input" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'decorator', 'label', 'description', 'feedback'],
};
