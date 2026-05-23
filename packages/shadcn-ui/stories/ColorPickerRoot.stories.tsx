/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import React from 'react';
import { ColorPickerButton, ColorPickerInput, ColorPickerRoot } from '../src';
import { ColorPickerCompactControls } from '../src/ColorPickerBase';

/**
 * `ColorPickerRoot` is the primitive building block for color pickers.
 * It manages value state and format conversions, and exposes everything
 * through a render prop — giving you full control over the trigger UI.
 *
 * Use it when you need a custom trigger or want to compose the picker
 * content yourself. For a batteries-included picker, use `ColorPickerBase`.
 */
type StoryArgs = Partial<
  ComponentProps<typeof ColorPickerRoot> & {
    id?: string;
  }
>;

const meta: Meta<StoryArgs> = {
  title: 'shadcn-ui/ColorPickerRoot',
  component: ColorPickerRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],

  argTypes: {
    value: {
      control: 'color',
      description: 'Controlled color value',
    },
    onChange: {
      action: 'onChange',
      description: 'Called when the color changes',
    },
    format: {
      control: { type: 'select' },
      options: ['hex', 'rgb', 'hsl', 'hsb'],
      description: 'Locked color format (omit to allow the user to switch)',
    },
    defaultFormat: {
      control: { type: 'select' },
      options: ['hex', 'rgb', 'hsl', 'hsb'],
      description: 'Default format when format is uncontrolled',
    },
  },
  decorators: [
    (Story) => (
      <div
        id="color-picker-root-div-1"
        className="flex items-center justify-center w-60 h-screen"
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Minimal trigger: a colored swatch button that opens the picker.
 */
export const Default: Story = {
  render: (args) => {
    const [color, setColor] = React.useState('hsl(217, 91%, 60%)');

    return (
      <ColorPickerRoot {...args} value={color} onChange={setColor}>
        <ColorPickerInput />
        <ColorPickerCompactControls presetColors={[]} sections={['picker']} />
      </ColorPickerRoot>
    );
  },
};

export function WithInput() {
  const [color, setColor] = React.useState('hsl(217, 91%, 60%)');

  return (
    <div id="color-picker-root-div-2" className="space-y-3 w-full">
      <div id="color-picker-root-div-3" className="text-sm font-medium">
        Current value: {color}
      </div>
      <ColorPickerRoot value={color} onChange={setColor} format="hsl">
        <ColorPickerInput />
        <ColorPickerCompactControls presetColors={[]} sections={['picker']} />
      </ColorPickerRoot>
    </div>
  );
}

export function WithButton() {
  const [color, setColor] = React.useState('hsl(217, 91%, 60%)');

  return (
    <div id="color-picker-root-div-4" className="space-y-3 w-full">
      <div id="color-picker-root-div-5" className="text-sm font-medium">
        Current value: {color}
      </div>
      <ColorPickerRoot value={color} onChange={setColor} format="hsl">
        <ColorPickerButton />
        <ColorPickerCompactControls presetColors={[]} sections={['picker']} />
      </ColorPickerRoot>
    </div>
  );
}
