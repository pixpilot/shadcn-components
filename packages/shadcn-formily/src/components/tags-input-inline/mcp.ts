import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { TagsInputInLineProps } from './TagsInputInline';
import { defineProps } from '@internal/mcp';

type TagsInputInLineOwnProps = OwnProps<TagsInputInLineProps, 'div'>;

export const meta: ComponentMeta<TagsInputInLineOwnProps> = {
  name: 'TagsInputInLine',
  category: 'Formily Inputs',
  description: 'A Formily-connected inline tag input for editing simple string arrays.',
  htmlElement: 'div',
  props: defineProps<TagsInputInLineOwnProps>({
    label: 'Label content or accessible label for the component.',
    value: 'Controlled value for the underlying field UI. Usually supplied by Formily.',
    editable: 'Forwarded to the underlying UI component.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    readOnly:
      'Makes the control read-only. Usually also respects the Formily field read-only state.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    placeholder: 'Placeholder text shown before a value is selected or entered.',
    emptyText: 'Forwarded to the underlying UI component.',
    maxTags: 'Forwarded to the underlying UI component.',
    allowDuplicates: 'Forwarded to the underlying UI component.',
    delimiter: 'Forwarded to the underlying UI component.',
    addOnPaste: 'Forwarded to the underlying UI component.',
    addOnTab: 'Forwarded to the underlying UI component.',
    onValidate: 'Forwarded to the underlying UI component.',
    freeSolo: 'Forwarded to the underlying UI component.',
    addButtonVisibility: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Array name="tags" title="Tags" x-decorator="FormItem" x-component="TagsInputInLine" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      title: 'Tags',
      'x-decorator': 'FormItem',
      'x-component': 'TagsInputInLine',
      items: { type: 'string' },
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'tags', 'array', 'input'],
};
