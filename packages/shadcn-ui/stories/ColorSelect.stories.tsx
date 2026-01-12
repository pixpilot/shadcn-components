import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ColorSelect } from '../src/ColorSelect';

/**
 * A color select component that displays a color box next to each option.
 * Perfect for selecting colors with visual feedback.
 */
const meta = {
  title: 'shadcn-ui/ColorSelect',
  component: ColorSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of color options with label and value (color hex/rgb/etc)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
    },
    keyboardMode: {
      control: { type: 'radio' },
      options: ['dropdown', 'cycle'],
      description:
        'Keyboard behavior: dropdown opens first (default) or ArrowUp/ArrowDown cycles selection when closed.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 250 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default color select with basic color options
 */
export const Default: Story = {
  args: {
    options: [
      { label: 'Red', value: '#FF0000' },
      { label: 'Blue', value: '#0000FF' },
      { label: 'Green', value: '#00FF00' },
      { label: 'Yellow', value: '#FFFF00' },
      { label: 'Magenta', value: '#FF00FF' },
    ],
    placeholder: 'Select a color',
  },
};

/**
 * Interactive example with state management showing the selected value
 */
export const WithSelectedValue: Story = {
  render: function Render() {
    const [color, setColor] = React.useState('#3b82f6');

    return (
      <div className="flex flex-col gap-4">
        <ColorSelect
          options={[
            { label: 'Red', value: '#ef4444' },
            { label: 'Blue', value: '#3b82f6' },
            { label: 'Green', value: '#22c55e' },
            { label: 'Yellow', value: '#eab308' },
            { label: 'Purple', value: '#a855f7' },
          ]}
          value={color}
          onChange={setColor}
          placeholder="Select a color..."
        />
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Selected color:{' '}
            <strong>
              {color
                ? `${
                    [
                      { label: 'Red', value: '#ef4444' },
                      { label: 'Blue', value: '#3b82f6' },
                      { label: 'Green', value: '#22c55e' },
                      { label: 'Yellow', value: '#eab308' },
                      { label: 'Purple', value: '#a855f7' },
                    ].find((opt) => opt.value === color)?.label
                  } (${color})`
                : 'None'}
            </strong>
          </p>
          {color && (
            <div className="mt-2 flex items-center gap-2">
              <span>Preview:</span>
              <div
                className="h-8 w-8 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
};

/**
 * With placeholder text
 */
export const WithPlaceholder: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState<string>('');
    return (
      <div className="space-y-4">
        <ColorSelect {...args} value={value} onChange={setValue} />
        <div className="text-sm text-muted-foreground">
          Selected value: <span className="font-mono">{value || 'none'}</span>
        </div>
      </div>
    );
  },
  args: {
    options: [
      { label: 'Red', value: '#ff0000' },
      { label: 'Green', value: '#00ff00' },
      { label: 'Blue', value: '#0000ff' },
      { label: 'Yellow', value: '#ffff00' },
      { label: 'Purple', value: '#800080' },
    ],
    placeholder: 'Choose your color',
  },
};

/**
 * Example with custom colors and labels
 */
export const CustomColors: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState('');

    return (
      <div className="space-y-4">
        <ColorSelect {...args} value={value} onChange={setValue} />
        <div className="text-sm text-gray-600">
          Selected value: <span className="font-mono">{value || 'none'}</span>
        </div>
      </div>
    );
  },
  args: {
    placeholder: 'Pick a brand color',
    options: [
      { label: 'Primary Red', value: '#dc2626' },
      { label: 'Ocean Blue', value: '#0284c7' },
      { label: 'Forest Green', value: '#16a34a' },
      { label: 'Sunset Orange', value: '#ea580c' },
      { label: 'Royal Purple', value: '#9333ea' },
      { label: 'Rose Pink', value: '#e11d48' },
    ],
  },
};

/**
 * Color select with controlled value
 */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-4">
        <ColorSelect
          options={[
            { label: 'Slate', value: '#64748b' },
            { label: 'Gray', value: '#6b7280' },
            { label: 'Zinc', value: '#71717a' },
            { label: 'Neutral', value: '#737373' },
            { label: 'Stone', value: '#78716c' },
          ]}
          value={value}
          onChange={setValue}
          placeholder="Select a neutral color"
        />
        <div className="text-sm text-gray-600">
          <div>Selected value: {value || 'None'}</div>
          {value && (
            <div className="mt-2 flex items-center gap-2">
              <span>Selected color:</span>
              <div
                className="h-6 w-6 rounded border border-gray-300"
                style={{ backgroundColor: value }}
              />
              <span className="font-mono text-sm">{value}</span>
            </div>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Keyboard cycle mode allows using arrow keys to cycle through colors when closed
 */
export const KeyboardCycleMode: Story = {
  render: function Render() {
    const [value, setValue] = React.useState('#ff0000');

    return (
      <div className="flex flex-col gap-4">
        <ColorSelect
          value={value}
          onChange={setValue}
          options={[
            { label: 'Red', value: '#ff0000' },
            { label: 'Green', value: '#00ff00' },
            { label: 'Blue', value: '#0000ff' },
            { label: 'Yellow', value: '#ffff00' },
            { label: 'Magenta', value: '#ff00ff' },
            { label: 'Cyan', value: '#00ffff' },
          ]}
          placeholder="Select a color"
          keyboardMode="cycle"
        />
        <div className="text-sm text-muted-foreground">
          Try using arrow keys to cycle through colors
        </div>
      </div>
    );
  },
};
