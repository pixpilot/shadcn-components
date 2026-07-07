import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ToggleButtonProps } from './ToggleButton';
import { defineProps } from '@internal/mcp';

type ToggleButtonOwnProps = OwnProps<ToggleButtonProps, 'button'>;

export const meta: ComponentMeta<ToggleButtonOwnProps> = {
  name: 'ToggleButton',
  category: 'Formily Inputs',
  description: 'A Formily-connected boolean toggle rendered as a shadcn toggle button.',
  htmlElement: 'button',
  props: defineProps<ToggleButtonOwnProps>({
    asChild: 'Renders behavior through the child element instead of the default element.',
    variant: 'Visual variant forwarded to the underlying UI component.',
    size: 'Size forwarded to the underlying UI component.',
    checked: 'Controlled checked state. Usually supplied by Formily.',
    checkedContent: 'Forwarded to the underlying UI component.',
    uncheckedContent: 'Forwarded to the underlying UI component.',
    checkedProps: 'Forwarded to the underlying UI component.',
    uncheckedProps: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Boolean name="active" title="Active" x-decorator="FormItem" x-component="ToggleButton" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    active: {
      type: 'boolean',
      title: 'Active',
      'x-decorator': 'FormItem',
      'x-component': 'ToggleButton',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'toggle', 'button', 'boolean'],
};
