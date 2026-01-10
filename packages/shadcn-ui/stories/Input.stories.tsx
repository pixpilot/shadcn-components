import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/input';

/**
 * Input component with optional prefix/suffix.
 * Built on top of `@pixpilot/shadcn` Input + InputGroup.
 */
const meta = {
  title: 'shadcn-ui/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    prefix: {
      control: false,
      description: 'ReactNode rendered before the input (inside the group)',
    },
    suffix: {
      control: false,
      description: 'ReactNode rendered after the input (inside the group)',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type something…',
  },
};

export const WithPrefix: Story = {
  args: {
    prefix: '$',
    placeholder: '0.00',
    inputMode: 'decimal',
  },
};

export const WithSuffix: Story = {
  args: {
    suffix: 'USD',
    placeholder: 'Amount',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    prefix: '@',
    suffix: <kbd>⌘K</kbd>,
    placeholder: 'username',
  },
};

export const Disabled: Story = {
  args: {
    prefix: 'https://',
    suffix: '.com',
    placeholder: 'example',
    disabled: true,
  },
};
