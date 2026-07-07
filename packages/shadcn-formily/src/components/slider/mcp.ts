import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { SliderProps } from './Slider';
import { defineProps } from '@internal/mcp';

type SliderOwnProps = OwnProps<SliderProps, 'div'>;

export const meta: ComponentMeta<SliderOwnProps> = {
  name: 'Slider',
  category: 'Formily Inputs',
  description: 'A Formily-connected slider for numeric range-style input.',
  htmlElement: 'div',
  props: defineProps<SliderOwnProps>({
    onValueChange: 'Controlled value-change callback. Usually supplied by Formily.',
    form: 'Formily form instance created with createForm().',
    asChild: 'Renders behavior through the child element instead of the default element.',
    value: 'Controlled value. Usually supplied by Formily.',
    name: 'HTML/form name forwarded to the underlying control.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    min: 'Minimum allowed numeric value.',
    max: 'Maximum allowed numeric value.',
    inverted: 'Forwarded to the underlying UI component.',
    step: 'Step interval for numeric changes.',
    orientation: 'Forwarded to the underlying UI component.',
    minStepsBetweenThumbs: 'Forwarded to the underlying UI component.',
    onValueCommit: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Number name="volume" title="Volume" x-decorator="FormItem" x-component="Slider" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    volume: {
      type: 'number',
      title: 'Volume',
      'x-decorator': 'FormItem',
      'x-component': 'Slider',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'slider', 'range', 'number'],
};
