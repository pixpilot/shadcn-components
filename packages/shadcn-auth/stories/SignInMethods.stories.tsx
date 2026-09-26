import type { Meta, StoryObj } from '@storybook/react';

import { SignInMethods } from '../src/components/sign-in-methods/SignInMethods';

const meta = {
  title: 'shadcn-auth/SignInMethods',
  component: SignInMethods,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    identities: [
      { provider: 'email', email: 'ada@example.com' },
      { provider: 'google', email: 'ada@gmail.com' },
    ],
    linkableProviders: ['google', 'github', 'linkedin_oidc'],
    onConnect: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="bg-card w-[min(100vw-2rem,34rem)] rounded-xl border p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SignInMethods>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConnectedAndAvailable: Story = {};

export const Connecting: Story = {
  args: { pendingProvider: 'github' },
};

export const ConnectionError: Story = {
  args: { error: 'That account is already connected elsewhere.' },
};

export const ReadOnly: Story = {
  args: { linkableProviders: [] },
};
