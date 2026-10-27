import type { Meta, StoryObj } from '@storybook/react';

import { SignedOutScreen } from '../src/components/SignedOutScreen';

const meta = {
  title: 'shadcn-auth/SignedOutScreen',
  component: SignedOutScreen,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SignedOutScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutContactLink: Story = {
  args: { contactHref: null },
};
