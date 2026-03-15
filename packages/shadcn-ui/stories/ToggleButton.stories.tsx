/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToggleButton } from '../src/ToggleButton';

/**
 * A toggle button component that can switch between checked and unchecked states.
 * Supports both controlled and uncontrolled usage with customizable content for each state.
 */
const meta = {
  title: 'shadcn-ui/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state for uncontrolled usage',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    checkedContent: {
      control: 'text',
      description: 'Content shown when checked',
    },
    uncheckedContent: {
      control: 'text',
      description: 'Content shown when unchecked',
    },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Toggle button in checked state
 */
export const Default: Story = {
  args: {
    defaultChecked: true,
    checkedContent: 'On',
    uncheckedContent: 'Off',
  },
};

/**
 * Toggle button with different content for checked/unchecked states
 */
export const WithIcons: Story = {
  args: {
    checkedContent: '✓ Enabled',
    uncheckedContent: '✗ Disabled',
  },
};

/**
 * Controlled toggle button
 */
export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <ToggleButton
        {...args}
        checked={checked}
        onChange={setChecked}
        checkedContent="Active"
        uncheckedContent="Inactive"
      />
    );
  },
};

/**
 * Disabled toggle button
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    checkedContent: 'On',
    uncheckedContent: 'Off',
  },
};
