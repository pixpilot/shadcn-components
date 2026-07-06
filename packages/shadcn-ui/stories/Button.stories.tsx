import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import React from 'react';
import { Button } from '../src/button';

const buttonSizes = [
  { size: 'xs', label: 'Extra small', children: 'Extra small' },
  { size: 'sm', label: 'Small', children: 'Small' },
  { size: 'default', label: 'Default', children: 'Default' },
  { size: 'lg', label: 'Large', children: 'Large' },
  { size: 'icon', label: 'Icon', children: '+' },
] as const;

type StoryArgs = Partial<
  ComponentProps<typeof Button> & {
    id?: string;
  }
>;

const meta: Meta<StoryArgs> = {
  title: 'shadcn-ui/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],

  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['default', 'xs', 'sm', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Button' },
};

export const Disabled: Story = {
  args: { disabled: true, title: 'Disabled reason', children: 'Disabled' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
};

export const Sizes: Story = {
  args: { variant: 'default' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {buttonSizes.map(({ size, label, children }) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Button {...args} size={size} aria-label={size === 'icon' ? label : undefined}>
            {children}
          </Button>
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const WithTitleTooltip: Story = {
  args: { title: 'Helpful tooltip text', children: 'Hover me' },
};

export const DisabledOverlayClickable: Story = {
  render: (args) => (
    <Button
      {...args}
      onDisabledClick={() => {
        // eslint-disable-next-line no-alert
        alert('Disabled overlay clicked');
      }}
      disabled
    >
      Disabled (click overlay)
    </Button>
  ),
};

export const AsChildLink: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Button {...args} asChild>
        <a href="https://example.com" target="_blank" rel="noreferrer">
          Open example link
        </a>
      </Button>

      <Button
        {...args}
        asChild
        disabled
        title="Disabled asChild link"
        onDisabledClick={() => {
          // eslint-disable-next-line no-alert
          alert('Disabled asChild overlay clicked');
        }}
      >
        <a href="https://example.com" target="_blank" rel="noreferrer">
          Disabled example link
        </a>
      </Button>
    </div>
  ),
};
