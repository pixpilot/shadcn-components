import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Slider } from '../src/slider';

/**
 * A customizable slider component for selecting values within a range.
 * Built on top of shadcn/ui Slider component.
 */
const meta = {
  title: 'shadcn-ui/Slider',
  component: Slider,
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
      description: 'Disables the slider',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEFAULT_VALUE = 50;
const RANGE_MIN = 25;
const RANGE_MAX = 75;
const DECIMAL_DEFAULT = 0.75;

/**
 * Default slider with basic configuration
 */
export const Default: Story = {
  args: {
    defaultValue: [DEFAULT_VALUE],
    min: 0,
    max: 100,
    step: 1,
  },
};

/**
 * Slider with range selection (two thumbs)
 */
export const Range: Story = {
  args: {
    defaultValue: [RANGE_MIN, RANGE_MAX],
    min: 0,
    max: 100,
    step: 1,
  },
};

/**
 * Disabled slider
 */
export const Disabled: Story = {
  args: {
    defaultValue: [DEFAULT_VALUE],
    min: 0,
    max: 100,
    step: 1,
    disabled: true,
  },
};

/**
 * Vertical slider
 */
export const Vertical: Story = {
  args: {
    defaultValue: [DEFAULT_VALUE],
    min: 0,
    max: 100,
    step: 1,
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 200, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Slider with decimal step for precise control
 */
export const DecimalStep: Story = {
  args: {
    defaultValue: [DECIMAL_DEFAULT],
    min: 0,
    max: 1,
    step: 0.01,
  },
};
