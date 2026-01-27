import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Select } from '../src/Select';

/**
 * A customizable select component with options.
 * Built on top of shadcn/ui Select component.
 */
const meta = {
  title: 'shadcn-ui/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options to display',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether to show a clear button when a value is selected',
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
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default select with basic options
 */
export const Default: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    placeholder: 'Select an option',
  },
  render: function DefaultSelect(args) {
    const [value, setValue] = useState<string>('');

    return <Select {...args} value={value} onChange={setValue} />;
  },
};

/**
 * Select with pre-selected value
 */
export const WithValue: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
    placeholder: 'Choose a fruit',
  },
  render: function WithValueSelect(args) {
    const [value, setValue] = useState<string>('banana');

    return <Select {...args} value={value} onChange={setValue} />;
  },
};

/**
 * Select with numeric values
 */
export const NumericValues: Story = {
  args: {
    options: [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
      { value: 3, label: 'Three' },
    ],
    placeholder: 'Select a number',
  },
  render: function NumericSelect(args) {
    const [value, setValue] = useState<string>('');

    return <Select {...args} value={value} onChange={setValue} />;
  },
};

/**
 * Select with clear button enabled
 */
export const Clearable: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
    placeholder: 'Choose a fruit',
    clearable: true,
  },
  render: function ClearableSelect(args) {
    const [value, setValue] = useState<string>('banana');

    return <Select {...args} value={value} onChange={setValue} />;
  },
};
