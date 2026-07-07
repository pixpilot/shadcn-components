import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ArrayToggleGroupProps } from './ArrayToggleGroup';
import { defineProps } from '@internal/mcp';

type ArrayToggleGroupOwnProps = OwnProps<ArrayToggleGroupProps, 'div'>;

export const meta: ComponentMeta<ArrayToggleGroupOwnProps> = {
  name: 'ArrayToggleGroup',
  category: 'Formily Arrays',
  description:
    'A Formily array field for multi-selecting from a fixed option set, rendered as a toggle button group. Works with `items.enum`.',
  htmlElement: 'div',
  props: defineProps<ArrayToggleGroupOwnProps>({
    value: 'Controlled value for the underlying field UI. Usually supplied by Formily.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    readOnly:
      'Makes the control read-only. Usually also respects the Formily field read-only state.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    slots: 'Slot props for customizing internal rendered parts.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    onValueChange: 'Controlled value-change callback. Usually supplied by Formily.',
    rovingFocus: 'Forwarded to the underlying UI component.',
    loop: 'Forwarded to the underlying UI component.',
    orientation: 'Forwarded to the underlying UI component.',
    variant: 'Visual variant forwarded to the underlying UI component.',
    size: 'Size forwarded to the underlying UI component.',
    spacing: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Multi-select toggle group',
      code: `{
  type: 'array',
  title: 'Select features',
  'x-decorator': 'FormItem',
  'x-component': 'ArrayToggleGroup',
  'x-component-props': { variant: 'outline', size: 'sm' },
  items: {
    type: 'string',
    enum: [
      { label: 'Bold', value: 'bold' },
      { label: 'Italic', value: 'italic' },
    ],
  },
}`,
    },
  ],
  keywords: ['formily', 'array', 'toggle', 'group', 'multi-select', 'enum'],
  related: ['ArrayTags'],
};
