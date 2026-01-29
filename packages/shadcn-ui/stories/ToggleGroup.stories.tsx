import type { Meta, StoryObj } from '@storybook/react';

import * as React from 'react';

import { ToggleGroup, ToggleGroupItem } from '../src/ToggleGroup';

type ToggleGroupStoryVariant = 'default' | 'outline';

type ToggleGroupStorySize = 'default' | 'sm' | 'lg';

interface ToggleGroupStoryArgs {
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  variant: ToggleGroupStoryVariant;
  size: ToggleGroupStorySize;
  spacing?: number;
}

function ToggleGroupPreview(args: ToggleGroupStoryArgs) {
  return (
    <ToggleGroup
      type="single"
      variant={args.variant}
      size={args.size}
      spacing={args.spacing}
      defaultValue={args.options[0]?.value}
    >
      {args.options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const meta = {
  title: 'shadcn-ui/ToggleGroup',
  component: ToggleGroupPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
    options: {
      control: { type: 'object' },
    },
    spacing: {
      control: { type: 'number' },
    },
  },
} satisfies Meta<typeof ToggleGroupPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleRadio: Story = {
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
    variant: 'outline',
    size: 'sm',
    spacing: 0,
  },
  render: function SingleRadioRender(args) {
    const [value, setValue] = React.useState('week');

    return (
      <ToggleGroup
        type="single"
        variant={args.variant}
        size={args.size}
        spacing={args.spacing}
        value={value}
        onValueChange={setValue}
      >
        {args.options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },
};

export const SingleAllowEmptySelection: Story = {
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
    variant: 'outline',
    size: 'sm',
    spacing: 0,
  },
  render: function SingleAllowEmptySelectionRender(args) {
    const [value, setValue] = React.useState('week');

    return (
      <ToggleGroup
        type="single"
        variant={args.variant}
        size={args.size}
        spacing={args.spacing}
        value={value}
        onValueChange={(nextValue: string) => {
          // Radix passes '' when deselecting in single mode.
          setValue(nextValue);
        }}
      >
        {args.options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },
};

export const MultipleCheckbox: Story = {
  args: {
    options: [
      { label: 'Bold', value: 'bold' },
      { label: 'Italic', value: 'italic' },
      { label: 'Underline', value: 'underline' },
    ],
    variant: 'outline',
    size: 'sm',
    spacing: 0,
  },
  render: function MultipleCheckboxRender(args) {
    const [value, setValue] = React.useState<string[]>(['bold']);

    return (
      <ToggleGroup
        type="multiple"
        variant={args.variant}
        size={args.size}
        spacing={args.spacing}
        value={value}
        onValueChange={setValue}
      >
        {args.options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },
};
