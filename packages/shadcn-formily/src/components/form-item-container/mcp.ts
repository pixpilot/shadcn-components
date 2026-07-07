import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { FormItemContainerProps } from './FormItemContainer';
import { defineProps } from '@internal/mcp';

type FormItemContainerOwnProps = OwnProps<FormItemContainerProps, 'div'>;

export const meta: ComponentMeta<FormItemContainerOwnProps> = {
  name: 'FormItemContainer',
  category: 'Formily Layout',
  description:
    'A low-level Formily form-item layout container for label, description, feedback, and field content.',
  htmlElement: 'div',
  props: defineProps<FormItemContainerOwnProps>({
    as: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="formItemContainer" title="FormItemContainer" x-decorator="FormItem" x-component="FormItemContainer" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    formItemContainer: {
      type: 'string',
      title: 'FormItemContainer',
      'x-decorator': 'FormItem',
      'x-component': 'FormItemContainer',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'form item', 'container', 'label'],
};
