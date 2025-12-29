import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SliderInput } from '../src/slider/SliderInput';

/**
 * A slider component with optional input fields for precise value entry.
 * Combines a slider with number inputs for each value in the range.
 */
const meta = {
  title: 'shadcn-ui/SliderInput',
  component: SliderInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value of the slider',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the slider',
    },
    step: {
      control: 'number',
      description: 'Step increment for the slider',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the slider and inputs',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider',
    },
    showInput: {
      control: 'boolean',
      description: 'Whether to show the input fields',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SliderInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEFAULT_SINGLE_VALUE = 50;
const RANGE_MIN_VALUE = 25;
const RANGE_MAX_VALUE = 75;
const DEFAULT_VALUE = [DEFAULT_SINGLE_VALUE];
const RANGE_VALUES = [RANGE_MIN_VALUE, RANGE_MAX_VALUE];
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const STEP_VALUE = 1;
const DECIMAL_STEP_VALUE = 0.1;
const DECIMAL_MIN_VALUE = 0;
const DECIMAL_MAX_VALUE = 10;
const DECIMAL_DEFAULT_SINGLE_VALUE = 5.5;
const DECIMAL_DEFAULT_VALUE = [DECIMAL_DEFAULT_SINGLE_VALUE];

/**
 * Default slider input with single value and input field
 */
export const Default: Story = {
  args: {
    min: MIN_VALUE,
    max: MAX_VALUE,
    step: STEP_VALUE,
    showInput: true,
  },
  render: function DefaultSliderInput(args) {
    const [value, setValue] = useState(DEFAULT_VALUE);

    return <SliderInput {...args} value={value} onValueChange={setValue} />;
  },
};

/**
 * Slider input with range selection (two thumbs and two inputs)
 */
export const Range: Story = {
  args: {
    min: MIN_VALUE,
    max: MAX_VALUE,
    step: STEP_VALUE,
    showInput: true,
  },
  render: function RangeSliderInput(args) {
    const [value, setValue] = useState(RANGE_VALUES);

    return <SliderInput {...args} value={value} onValueChange={setValue} />;
  },
};

/**
 * Slider input without input fields (slider only)
 */
export const SliderOnly: Story = {
  args: {
    min: MIN_VALUE,
    max: MAX_VALUE,
    step: STEP_VALUE,
    showInput: false,
  },
  render: function SliderOnlyInput(args) {
    const [value, setValue] = useState(DEFAULT_VALUE);

    return <SliderInput {...args} value={value} onValueChange={setValue} />;
  },
};

/**
 * Disabled slider input
 */
export const Disabled: Story = {
  args: {
    min: MIN_VALUE,
    max: MAX_VALUE,
    step: STEP_VALUE,
    showInput: true,
    disabled: true,
  },
  render: function DisabledSliderInput(args) {
    const [value, setValue] = useState(DEFAULT_VALUE);

    return <SliderInput {...args} value={value} onValueChange={setValue} />;
  },
};

/**
 * Vertical slider input
 */
export const Vertical: Story = {
  args: {
    min: MIN_VALUE,
    max: MAX_VALUE,
    step: STEP_VALUE,
    showInput: true,
    orientation: 'vertical',
  },
  render: function VerticalSliderInput(args) {
    const [value, setValue] = useState(DEFAULT_VALUE);

    return <SliderInput {...args} value={value} onValueChange={setValue} />;
  },
  decorators: [
    (Story) => (
      <div style={{ height: 300, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Slider input with decimal step for precise decimal values
 */
export const DecimalStep: Story = {
  args: {
    min: DECIMAL_MIN_VALUE,
    max: DECIMAL_MAX_VALUE,
    step: DECIMAL_STEP_VALUE,
    showInput: true,
  },
  render: function DecimalStepSliderInput(args) {
    const [value, setValue] = useState(DECIMAL_DEFAULT_VALUE);

    return <SliderInput {...args} value={value} onValueChange={setValue} />;
  },
};

export const SliderControlled: Story = {
  render: () => {
    const Component = () => {
      const [value, setValue] = useState(30);
      return (
        <div className="space-y-4">
          <SliderInput
            value={[value]}
            onValueChange={([val]) => setValue(val!)}
            min={0}
            max={100}
            step={1}
            showInput
          />
          <div>Current Value: {value}</div>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={() => setValue(70)}
          >
            Set Value to 70
          </button>
        </div>
      );
    };
    return <Component />;
  },
};
