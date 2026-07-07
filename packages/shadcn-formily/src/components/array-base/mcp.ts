import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { IArrayBaseProps } from './types';
import { defineProps } from '@internal/mcp';

type ArrayBaseOwnProps = OwnProps<IArrayBaseProps, 'div'>;

export const meta: ComponentMeta<ArrayBaseOwnProps> = {
  name: 'ArrayBase',
  category: 'Formily Arrays',
  description:
    'Low-level Formily array context provider and mixin base used by the higher-level array components.',
  htmlElement: 'div',
  props: defineProps<ArrayBaseOwnProps>({
    disabled: 'Disables array operations for children using the array context.',
    sortable:
      'Enables sortable behavior for array components that use ArrayBase context.',
    onAdd: 'Called when an array item is added.',
    onRemove: 'Called when an array item is removed.',
    onMoveUp: 'Called when an array item is moved up.',
    onMoveDown: 'Called when an array item is moved down.',
    onEdit: 'Called when an array item edit action is triggered.',
    actions: 'Item operation actions available to child array renderers.',
    transformActions:
      'Callback that transforms the resolved action list before rendering.',
    description: 'Description content made available to array renderers.',
  }),
  examples: [
    {
      title: 'Prefer high-level array components',
      code: `<SchemaField.Array name="items" x-component="ArrayCards" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    items: {
      type: 'array',
      'x-component': 'ArrayCards',
      items: { type: 'object', properties: {} },
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'array', 'base', 'context'],
  related: ['ArrayCards', 'ArrayCollapse', 'ArrayDialog', 'ArrayInline', 'ArrayPopover'],
};
