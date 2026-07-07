import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { TextareaProps } from './Textarea';
import { defineProps } from '@internal/mcp';

type TextareaOwnProps = OwnProps<TextareaProps, 'textarea'>;

export const meta: ComponentMeta<TextareaOwnProps> = {
  name: 'Textarea',
  category: 'Formily Inputs',
  description: 'A Formily-connected multiline text input.',
  htmlElement: 'textarea',
  props: defineProps<TextareaOwnProps>({}),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="textarea" title="Textarea" x-decorator="FormItem" x-component="Textarea" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    textarea: {
      type: 'string',
      title: 'Textarea',
      'x-decorator': 'FormItem',
      'x-component': 'Textarea',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'textarea', 'multiline', 'text'],
};
