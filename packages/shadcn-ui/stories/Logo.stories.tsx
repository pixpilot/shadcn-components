import type { Meta, StoryObj } from '@storybook/react';
import { BrandLogo, Logo } from '../src/logo';

const LOGO_SRC = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#6366f1"/><path d="M7 17V7h6a3 3 0 0 1 0 6H7" fill="none" stroke="#fff" stroke-width="2"/></svg>',
)}`;

const meta = {
  title: 'shadcn-ui/Logo',
  component: BrandLogo,
  args: {
    name: 'Acme',
    logoProps: { src: LOGO_SRC },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 32,
    className: 'text-2xl',
  },
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Logo src={LOGO_SRC} size={16} />
      <Logo src={LOGO_SRC} />
      <Logo src={LOGO_SRC} size={48} />
    </div>
  ),
};
