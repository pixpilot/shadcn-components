import type { Meta, StoryObj } from '@storybook/react';

import { CompleteProfileForm } from '../src/components/CompleteProfileForm';

const meta = {
  title: 'shadcn-auth/CompleteProfileForm',
  component: CompleteProfileForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onSubmit: async () => undefined,
    maxDisplayNameLength: 80,
    isLoading: false,
    error: null,
    email: 'ada@example.com',
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100vw-2rem,28rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompleteProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPrefilledName: Story = {
  args: { defaultName: 'Ada Lovelace' },
};

export const WithError: Story = {
  args: { error: 'Please choose a different display name.' },
};
