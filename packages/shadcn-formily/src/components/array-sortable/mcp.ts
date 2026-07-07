import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { SortableContainerProps } from './SortableContainer';
import { defineProps } from '@internal/mcp';

type SortableContainerOwnProps = OwnProps<SortableContainerProps, 'div'>;

export const meta: ComponentMeta<SortableContainerOwnProps> = {
  name: 'SortableContainer',
  category: 'Formily Arrays',
  description:
    'Low-level drag-and-drop context wrapper used by sortable Formily array components.',
  htmlElement: 'div',
  props: defineProps<SortableContainerOwnProps>({
    disabled: 'Disables drag-and-drop sorting.',
    onSortEnd: 'Called with old and new indexes after a sort completes.',
  }),
  examples: [
    {
      title: 'Prefer sortable array components',
      code: `<SchemaField.Array name="items" x-component="ArrayCards" x-component-props={{ sortable: true }} />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    items: {
      type: 'array',
      'x-component': 'ArrayCards',
      'x-component-props': { sortable: true },
      items: { type: 'object', properties: {} },
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'array', 'sortable', 'drag and drop'],
  related: ['ArrayCards', 'ArrayCollapse', 'ArrayInline'],
};
