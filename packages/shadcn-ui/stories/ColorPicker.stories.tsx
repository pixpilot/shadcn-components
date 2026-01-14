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
    contentProps: {
      control: 'object',
      description: 'Props to customize the color picker content wrapper',
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

/**
 * Input variant with custom placeholder
 */
export const WithPlaceholder: Story = {
  args: {
    variant: 'input',
    placeholder: 'Choose your favorite color',
  },
};

/**
 * Button variant (default display)
 */
export const ButtonVariant: Story = {
  args: {
    variant: 'button',
  },
};

/**
 * With custom format display value function
 */
export const WithFormatDisplay: Story = {
  args: {
    variant: 'button',
    formatDisplayValue: (value: string) => {
      // Example: Show color name instead of hex
      const colorNames: Record<string, string> = {
        '#ff0000': 'Red',
        '#00ff00': 'Green',
        '#0000ff': 'Blue',
        '#ffff00': 'Yellow',
        '#ff00ff': 'Magenta',
        '#00ffff': 'Cyan',
      };
      return colorNames[value.toLowerCase()] != null || value;
    },
  },
};

/**
 * Compact layout (hides advanced controls by default)
 */
export const CompactLayout: Story = {
  args: {
    layout: 'compact',
  },
};

/**
 * Full layout with all controls visible
 */
export const FullLayout: Story = {
  args: {
    layout: 'full',
  },
};

/**
 * With preset colors
 */
export const WithPresetColors: Story = {
  args: {
    presetColors: [
      { label: 'Red', value: '#ff0000' },
      { label: 'Green', value: '#00ff00' },
      { label: 'Blue', value: '#0000ff' },
      { label: 'Yellow', value: '#ffff00' },
      { label: 'Magenta', value: '#ff00ff' },
      { label: 'Cyan', value: '#00ffff' },
      { label: 'White', value: '#ffffff' },
      { label: 'Black', value: '#000000' },
    ],
  },
};

/**
 * Controlled component with state management
 */
export const Controlled: React.FC = () => {
  const [color, setColor] = React.useState('#3b82f6');

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Selected color: <span className="font-mono">{color}</span>
      </div>
      <ColorPicker
        value={color}
        onChange={setColor}
        variant="input"
        placeholder="Select a color"
      />
      <div className="w-16 h-16 rounded border" style={{ backgroundColor: color }} />
    </div>
  );
};

/**
 * With custom formatted display and button variant
 */
export const CustomDisplayButton: React.FC = () => {
  const [color, setColor] = React.useState('#ff6b6b');

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      variant="button"
      formatDisplayValue={(value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: value }} />
          {/* <span className="font-mono text-sm">{value.toUpperCase()}</span> */}
        </div>
      )}
    />
  );
};

/**
 * With custom formatted display and button variant
 */
export const CustomDisplayFormat: React.FC = () => {
  const [color, setColor] = React.useState('#ff6b6b');

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      variant="button"
      formatDisplayValue={(value: string) => `Color: ${value.toUpperCase()}`}
    />
  );
};

export const WithContentWidth: Story = {
  args: {
    contentProps: { width: 180 },
  },
};
