import type { ComponentMeta } from '@internal/mcp';
import { defineProps } from '@internal/mcp';

type ArrayToggleGroupProp = 'options' | 'disabled' | 'readOnly' | 'slots' | 'variant';

export const meta: ComponentMeta<ArrayToggleGroupProp> = {
  name: 'ArrayToggleGroup',
  category: 'Formily Arrays',
  description:
    'A Formily array field for multi-selecting from a fixed option set, rendered as a toggle button group. Works with `items.enum`.',
  htmlElement: 'div',
  props: defineProps<ArrayToggleGroupProp>({
    options:
      'Explicit `{ label, value, disabled? }` options. When omitted, options are resolved from the field/schema (`items.enum`).',
    disabled: 'Disables the whole group. Falls back to the field disabled state.',
    readOnly: 'Makes the group read-only. Falls back to the field read-only state.',
    slots: 'Slot overrides, e.g. `slots.button.className` applied to every toggle button.',
    variant: {
      description: 'Visual variant forwarded to the underlying ToggleGroup.',
      type: `'default' | 'outline'`,
      defaultValue: `'outline'`,
    },
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
