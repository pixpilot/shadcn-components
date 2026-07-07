import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { RadioProps } from './Radio';
import { defineProps } from '@internal/mcp';

type RadioOwnProps = OwnProps<RadioProps, 'div'>;

export const meta: ComponentMeta<RadioOwnProps> = {
  name: 'Radio',
  category: 'Formily Inputs',
  description:
    'A Formily-connected radio group/selectable radio field that uses schema enum/dataSource options.',
  htmlElement: 'div',
  props: defineProps<RadioOwnProps>({
    value: 'Controlled value for the underlying field UI. Usually supplied by Formily.',
    required: 'Marks the control as required for accessibility and UI state.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    loop: 'Forwarded to the underlying UI component.',
    orientation: 'Forwarded to the underlying UI component.',
    name: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.String name="radio" title="Radio" x-decorator="FormItem" x-component="Radio" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    radio: {
      type: 'string',
      title: 'Radio',
      'x-decorator': 'FormItem',
      'x-component': 'Radio',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'radio', 'options', 'choice'],
};
