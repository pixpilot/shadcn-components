import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { SliderProps } from './Slider';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `SliderProps` is a compile error until it is documented here.
// `SliderProps` forwards all Radix Slider props, which extend the native `div`
// props, so subtract that native surface. `defaultValue` is a native attribute
// name that Radix redefines as the uncontrolled value array, so re-add it via
// the extra-props parameter.
type SliderDocumentedProps = DocumentedProps<SliderProps, 'div', 'defaultValue'>;

export const meta: ComponentMeta<SliderDocumentedProps> = {
  name: 'Slider',
  category: 'Forms',
  description:
    'A range slider wrapping the shadcn slider with extra vertical padding. Supports single-thumb and multi-thumb (range) values.',
  props: defineProps<SliderDocumentedProps>({
    value: {
      description: 'Controlled value(s). Provide multiple numbers for a range slider.',
      type: 'number[]',
    },
    defaultValue: {
      description: 'Initial value(s) when uncontrolled.',
      type: 'number[]',
    },
    onValueChange: {
      description: 'Called with the new value array as the thumb(s) move.',
      type: '(value: number[]) => void',
    },
    min: {
      description: 'Minimum value.',
      type: 'number',
      defaultValue: '0',
    },
    max: {
      description: 'Maximum value.',
      type: 'number',
      defaultValue: '100',
    },
    step: {
      description: 'Step increment between values.',
      type: 'number',
      defaultValue: '1',
    },
    disabled: 'Disables slider interaction.',
    orientation: {
      description: 'Slider orientation.',
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
    },
    onValueCommit: {
      description: 'Called with the final value array when the user stops dragging.',
      type: '(value: number[]) => void',
    },
    minStepsBetweenThumbs: {
      description: 'Minimum number of steps to keep between thumbs in a range slider.',
      type: 'number',
      defaultValue: '0',
    },
    inverted: {
      description: 'Visually and functionally inverts the slider direction.',
      type: 'boolean',
      defaultValue: 'false',
    },
    name: 'Form field name submitted with the slider value for native form integration.',
    form: 'Associates the slider with a form by id when rendered outside of it.',
    asChild: {
      description:
        'Merge behavior and styles onto the child element instead of the default wrapper.',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Single value',
      code: '<Slider value={[volume]} onValueChange={([v]) => setVolume(v)} max={100} />',
    },
    {
      title: 'Range',
      code: '<Slider value={range} onValueChange={setRange} min={0} max={1000} step={10} />',
    },
  ],
  keywords: ['slider', 'range', 'input', 'form'],
};
