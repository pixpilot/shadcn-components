import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { SeparatorProps } from './Separator';
import { defineProps } from '@internal/mcp';

type SeparatorOwnProps = OwnProps<SeparatorProps, 'div'>;

export const meta: ComponentMeta<SeparatorOwnProps> = {
  name: 'Separator',
  category: 'Formily Layout',
  description: 'A visual separator that can be used inside Formily schema layouts.',
  htmlElement: 'div',
  props: defineProps<SeparatorOwnProps>({
    asChild: 'Renders behavior through the child element instead of the default element.',
    orientation: 'Forwarded to the underlying UI component.',
    decorative: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="separator" title="Separator" x-decorator="FormItem" x-component="Separator" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    separator: {
      type: 'string',
      title: 'Separator',
      'x-decorator': 'FormItem',
      'x-component': 'Separator',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'separator', 'divider', 'layout'],
};
