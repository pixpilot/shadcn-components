import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { IconToggleProps } from './IconToggle';
import { defineProps } from '@internal/mcp';

type IconToggleOwnProps = OwnProps<IconToggleProps, 'button'>;

export const meta: ComponentMeta<IconToggleOwnProps> = {
  name: 'IconToggle',
  category: 'Formily Inputs',
  description: 'A Formily-connected boolean toggle rendered as an icon button.',
  htmlElement: 'button',
  props: defineProps<IconToggleOwnProps>({
    asChild: 'Renders behavior through the child element instead of the default element.',
    variant: 'Visual variant forwarded to the underlying UI component.',
    size: 'Size forwarded to the underlying UI component.',
    checked: 'Controlled checked state. Usually supplied by Formily.',
    checkedProps: 'Forwarded to the underlying UI component.',
    uncheckedProps: 'Forwarded to the underlying UI component.',
    checkedIcon: 'Forwarded to the underlying UI component.',
    uncheckedIcon: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Boolean name="favorite" title="Favorite" x-decorator="FormItem" x-component="IconToggle" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    favorite: {
      type: 'boolean',
      title: 'Favorite',
      'x-decorator': 'FormItem',
      'x-component': 'IconToggle',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'icon', 'toggle', 'boolean'],
};
