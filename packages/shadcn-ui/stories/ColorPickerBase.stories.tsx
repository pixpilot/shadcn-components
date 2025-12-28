import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ColorPickerBase } from '../src/ColorPickerBase';

/**
 * A comprehensive color picker component with multiple selection methods.
 * Features include color area selection, hue slider, alpha transparency,
 * eye dropper tool, format selection, and input fields.
 */
const meta = {
  title: 'shadcn-ui/ColorPickerBase',
  component: ColorPickerBase,
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
  },
} satisfies Meta<typeof ColorPickerBase>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultChild(props: { value?: string }) {
  const { value } = props;
  return (
    <div className="h-10 w-50" style={{ background: value }}>
      {value}
    </div>
  );
}

/**
 * Default color picker with all features enabled
 */
export const Default: Story = {
  args: {
    children: DefaultChild,
  },
};

/**
 * Compact color picker that shows full controls only when toggled
 */
export const Compact: Story = {
  args: {
    children: DefaultChild,
    layout: 'compact',
  },
};

/**
 * Full color picker with all controls always visible
 */
export const Full: Story = {
  args: {
    children: DefaultChild,
    layout: 'full',
  },
};
function ControlledColorPicker() {
  const [value, setValue] = React.useState('hsl(0, 0%, 0%)');

  return (
    <div className="space-y-4 mb-20">
      <div className="text-sm font-medium">Current Value: {value}</div>
      <ColorPickerBase onChange={setValue} value={value} format="hsl">
        {(props) => (
          <div className="h-10 w-50" style={{ background: props.value }}>
            {props.value}
          </div>
        )}
      </ColorPickerBase>
    </div>
  );
}

function UncontrolledColorPicker() {
  const [value, setValue] = React.useState('hsl(0, 0%, 0%)');

  return (
    <div className="space-y-4 mb-20">
      <div className="text-sm font-medium">Current Value: {value}</div>
      <ColorPickerBase onChange={setValue}>
        {(props) => (
          <div className="h-10 w-50" style={{ background: props.value }}>
            {props.value}
          </div>
        )}
      </ColorPickerBase>
    </div>
  );
}

export const Controlled = () => <ControlledColorPicker />;

export const Uncontrolled = () => <UncontrolledColorPicker />;

/**
 * Compact color picker with custom swatch colors
 */
export const CompactWithCustomSwatches: Story = {
  args: {
    layout: 'compact',
    presetColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    children: DefaultChild,
  },
};
