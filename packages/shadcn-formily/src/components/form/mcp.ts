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
    settings:
      'Optional form-wide settings passed through the Formily shadcn form context. Each key holds default props applied to every instance of that component in the form (field-level x-component-props still override them). Notably `settings.richTextEditor` accepts the full RichTextEditorProps, so you can register TipTap `extensions` (and their toolbar buttons) once for all RichTextEditor fields. See the "RichTextEditor extensions via form settings" example.',
  }),
  examples: [
    {
      title: 'Basic Formily form',
      code: '<Form form={form} onSubmit={(values) => save(values)}><SchemaField schema={schema} /></Form>',
    },
    {
      title: 'RichTextEditor extensions via form settings',
      code: `import { Mark, mergeAttributes } from '@tiptap/core';

// Register a custom TipTap extension (or an official package like
// @tiptap/extension-highlight) once for every RichTextEditor field in the form.
const Highlight = Mark.create({
  name: 'highlight',
  parseHTML() {
    return [{ tag: 'mark' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0];
  },
});

<Form
  form={form}
  settings={{
    richTextEditor: {
      extensions: [Highlight],
      toolbarItems: [
        'bold',
        'italic',
        '|',
        {
          icon: '🖍️',
          tooltip: 'Highlight',
          onClick: (editor) => editor.chain().focus().toggleMark('highlight').run(),
          isActive: (editor) => editor.isActive('highlight'),
        },
      ],
    },
  }}
>
  <SchemaField schema={schema} />
</Form>`,
    },
  ],
  keywords: ['formily', 'form', 'provider'],
};
