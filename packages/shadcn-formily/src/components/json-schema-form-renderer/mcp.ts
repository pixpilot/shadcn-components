import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { JsonSchemaFormRendererProps } from './types';
import { defineProps } from '@internal/mcp';

type JsonSchemaFormRendererOwnProps = OwnProps<JsonSchemaFormRendererProps, 'form'>;

export const meta: ComponentMeta<JsonSchemaFormRendererOwnProps> = {
  name: 'JsonSchemaFormRenderer',
  category: 'Formily',
  description:
    'A renderer that turns JSON schema into a Formily form using the built-in shadcn component registry.',
  htmlElement: 'form',
  props: defineProps<JsonSchemaFormRendererOwnProps>({
    form: 'Formily form instance created with createForm().',
    layout: 'Layout settings passed into the form context.',
    components: 'Component registry overrides merged with the defaults.',
    schema: 'JSON/Formily schema to render.',
    onAutoSubmit: 'Called after a successful form submission.',
    settings: 'Form settings passed into the form context.',
  }),
  examples: [
    {
      title: 'Render JSON schema',
      code: `<JsonSchemaFormRenderer form={form} schema={schema} />`,
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
  keywords: ['formily', 'json schema', 'renderer', 'form'],
};
