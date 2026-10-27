import type { Meta, StoryObj } from '@storybook/react';

import { SignInScreen } from '../src/components/SignInScreen';

const meta = {
  title: 'shadcn-auth/SignInScreen',
  component: SignInScreen,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    onSignIn: async () => undefined,
  },
} satisfies Meta<typeof SignInScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SignInFails: Story = {
  args: {
    onSignIn: async () => Promise.reject(new Error('Could not open the tab')),
  },
};
