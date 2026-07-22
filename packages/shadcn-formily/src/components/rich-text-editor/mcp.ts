import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { RichTextEditorProps } from './RichTextEditor';
import { defineProps } from '@internal/mcp';

type RichTextEditorOwnProps = OwnProps<RichTextEditorProps, 'div'>;

export const meta: ComponentMeta<RichTextEditorOwnProps> = {
  name: 'RichTextEditor',
  category: 'Formily Inputs',
  description:
    'A Formily-connected rich text editor for editing formatted HTML/content values.',
  htmlElement: 'div',
  props: defineProps<RichTextEditorOwnProps>({
    value: 'Controlled value for the underlying field UI. Usually supplied by Formily.',
    editable: 'Forwarded to the underlying UI component.',
    editorProps: 'Forwarded to the underlying UI component.',
    immediatelyRender: 'Forwarded to the underlying UI component.',
    extensions:
      'Additional TipTap extensions forwarded to the underlying UI component, appended to the built-in ones (StarterKit, Link, TextAlign, Placeholder). Accepts any TipTap Extension, Node, or Mark. In schema forms pass them via `x-component-props.extensions`. See the "Add a custom extension" example.',
    slots: 'Slot props for customizing internal rendered parts.',
    showToolbar: 'Forwarded to the underlying UI component.',
    toolbarItems: 'Forwarded to the underlying UI component.',
    tooltipMode: 'Forwarded to the underlying UI component.',
    placeholder: 'Placeholder text shown before a value is selected or entered.',
    allowLinkTarget: 'Forwarded to the underlying UI component.',
    openOnClick: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="richTextEditor" title="RichTextEditor" x-decorator="FormItem" x-component="RichTextEditor" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    richTextEditor: {
      type: 'string',
      title: 'RichTextEditor',
      'x-decorator': 'FormItem',
      'x-component': 'RichTextEditor',
    },
  },
}`,
    },
    {
      title: 'Add a custom extension via x-component-props',
      code: `import { Mark, mergeAttributes } from '@tiptap/core';

// Any Mark.create / Node.create / Extension.create result (or an official
// package like @tiptap/extension-highlight) can be passed to \`extensions\`.
const Highlight = Mark.create({
  name: 'highlight',
  parseHTML() {
    return [{ tag: 'mark' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0];
  },
});

const schema = {
  type: 'object',
  properties: {
    richText: {
      type: 'string',
      title: 'Rich Text Editor',
      'x-decorator': 'FormItem',
      'x-component': 'RichTextEditor',
      'x-component-props': {
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
    },
  },
};`,
    },
  ],
  keywords: ['formily', 'rich text', 'editor', 'html'],
};
