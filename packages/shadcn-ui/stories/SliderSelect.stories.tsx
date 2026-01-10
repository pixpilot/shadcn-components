import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SliderSelect } from '../src/slider/SliderSelect';

/**
 * Discrete slider that maps positions to provided options,
 * plus an optional dropdown for direct selection.
 */
const meta = {
  title: 'shadcn-ui/SliderSelect',
  component: SliderSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Discrete options that the slider maps between',
    },
    showSelect: {
      control: 'boolean',
      description: 'Whether to show the dropdown selector',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the slider and dropdown',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SliderSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZE_OPTIONS = ['sx', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

export const Sizes: Story = {
  args: {
    options: [...SIZE_OPTIONS],
    showSelect: true,
  },
  render: function SizesStory(args) {
    const [value, setValue] = useState<(typeof SIZE_OPTIONS)[number]>('md');

    return (
      <div className="space-y-3">
        <SliderSelect
          {...args}
          value={value}
          onValueChange={(v) => setValue(v as (typeof SIZE_OPTIONS)[number])}
        />
        <div>Current value: {value}</div>
      </div>
    );
  },
};

export const WithoutDropdown: Story = {
  args: {
    options: [...SIZE_OPTIONS],
    showSelect: false,
  },
  render: function WithoutDropdownStory(args) {
    const [value, setValue] = useState<(typeof SIZE_OPTIONS)[number]>('sm');
    return (
      <div className="space-y-3">
        <SliderSelect
          {...args}
          value={value}
          onValueChange={(v) => setValue(v as (typeof SIZE_OPTIONS)[number])}
        />
        <div>Current value: {value}</div>
      </div>
    );
  },
};

export const Numeric: Story = {
  args: {
    options: [1, 2, 3, 4, 5],
    showSelect: true,
  },
  render: function NumericStory(args) {
    const [value, setValue] = useState<number>(3);
    return (
      <div className="space-y-3">
        <SliderSelect
          {...args}
          value={value}
          onValueChange={(v) => setValue(Number(v))}
        />
        <div>Current value: {value}</div>
      </div>
    );
  },
};
