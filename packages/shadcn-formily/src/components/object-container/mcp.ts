import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ObjectContainerProps } from './ObjectContainer';
import { defineProps } from '@internal/mcp';

type ObjectContainerOwnProps = OwnProps<ObjectContainerProps, 'div'>;

export const meta: ComponentMeta<ObjectContainerOwnProps> = {
  name: 'ObjectContainer',
  category: 'Formily Layout',
  description:
    'A Formily object wrapper that renders object title, description, children, and responsive spacing.',
  htmlElement: 'div',
  props: defineProps<ObjectContainerOwnProps>({
    label: 'Label content or accessible label for the component.',
    description: 'Description content rendered with the component.',
    variant: 'Visual variant forwarded to the underlying UI component.',
    slotProps: 'Slot props for customizing internal rendered parts.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="objectContainer" title="ObjectContainer" x-decorator="FormItem" x-component="ObjectContainer" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    objectContainer: {
      type: 'string',
      title: 'ObjectContainer',
      'x-decorator': 'FormItem',
      'x-component': 'ObjectContainer',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'object', 'container', 'layout'],
};
