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
    extensions: 'Forwarded to the underlying UI component.',
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
  ],
  keywords: ['formily', 'rich text', 'editor', 'html'],
};
