import type { ComponentMeta, OwnProps } from '@internal/mcp';

import type { IFormProps } from './Form';
import { defineProps } from '@internal/mcp';

type FormOwnProps = OwnProps<IFormProps, 'form'>;

export const meta: ComponentMeta<FormOwnProps> = {
  name: 'Form',
  category: 'Formily',
  description:
    'A Formily form provider wrapper that renders a native form element and wires submit handling into the Formily form instance.',
  htmlElement: 'form',
  props: defineProps<FormOwnProps>({
    form: {
      description: 'The Formily form instance created with createForm().',
      type: 'Form',
      required: true,
    },
    layout:
      'Optional layout configuration passed through the Formily shadcn form context.',
    onAutoSubmit:
      'Called with submitted values after the underlying Formily form submit succeeds.',
    settings: 'Optional form settings passed through the Formily shadcn form context.',
  }),
  examples: [
    {
      title: 'Basic Formily form',
      code: '<Form form={form} onSubmit={(values) => save(values)}><SchemaField schema={schema} /></Form>',
    },
  ],
  keywords: ['formily', 'form', 'provider'],
};
