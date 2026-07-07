import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { InputProps } from './Input';
import { defineProps } from '@internal/mcp';

type InputOwnProps = OwnProps<InputProps, 'input'>;

export const meta: ComponentMeta<InputOwnProps> = {
  name: 'Input',
  category: 'Formily Inputs',
  description:
    'A Formily-connected text input that normalizes empty field values to an empty string.',
  htmlElement: 'input',
  props: defineProps<InputOwnProps>({
    suffix: 'Forwarded to the underlying UI component.',
    groupClassName: 'Forwarded to the underlying UI component.',
    prefixClassName: 'Forwarded to the underlying UI component.',
    suffixClassName: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="input" title="Input" x-decorator="FormItem" x-component="Input" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    input: {
      type: 'string',
      title: 'Input',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'input', 'text', 'field'],
};
