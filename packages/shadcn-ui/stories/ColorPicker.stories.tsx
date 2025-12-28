import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { ColorPicker } from '../src/ColorPicker';

/**
 * A comprehensive color picker component with multiple selection methods.
 * Features include color area selection, hue slider, alpha transparency,
 * eye dropper tool, format selection, and input fields.
 */
const meta = {
  title: 'shadcn-ui/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'color',
      description: 'The current color value',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback when color changes',
    },
    presetColors: {
      control: 'object',
      description: 'Array of custom swatch colors',
    },
    layout: {
      control: { type: 'select' },
      options: ['full', 'compact'],
      description:
        'Display mode: full shows all controls, compact hides advanced controls by default',
    },
    variant: {
      control: { type: 'select' },
      options: ['input', 'button'],
      description:
        'Display variant: inline shows the picker directly, button shows a trigger button',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-50 mb-50">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default color picker with all features enabled
 */
export const Default: Story = {
  args: {},
};

export const WithButton: Story = {
  args: {
    variant: 'button',
  },
};

export const WithControlled: React.FC = () => {
  const [color, setColor] = React.useState('#ff0000');

  return (
    <div>
      {color}
      <ColorPicker
        value={color}
        onChange={(newColor) => setColor(newColor)}
        layout="full"
      />
    </div>
  );
};
