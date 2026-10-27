import type { Meta, StoryObj } from '@storybook/react';

import { AuthCallbackScreen } from '../src/components/AuthCallbackScreen';

const meta = {
  title: 'shadcn-auth/AuthCallbackScreen',
  component: AuthCallbackScreen,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    status: { kind: 'loading' },
  },
} satisfies Meta<typeof AuthCallbackScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const Success: Story = {
  args: { status: { kind: 'success' } },
};

export const Failed: Story = {
  args: { status: { kind: 'error', message: 'Auth code has expired' } },
};
