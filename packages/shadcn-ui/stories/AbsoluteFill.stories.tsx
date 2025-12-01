import type { Meta, StoryObj } from '@storybook/react';
import { AbsoluteFill } from '../src/AbsoluteFill';
import { Button } from '../src/Button';

/**
 * A stretched element positioned absolutely to enable tooltips on disabled buttons.
 * Useful when you need to capture events over a disabled element.
 */
const meta = {
  title: 'shadcn-ui/AbsoluteFill',
  component: AbsoluteFill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AbsoluteFill>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * AbsoluteFill over a disabled button to enable tooltips
 */
export const Default: Story = {
  render: () => (
    <div className="relative inline-block">
      <Button disabled>Disabled Button</Button>
      <AbsoluteFill title="This tooltip works on disabled button!" />
    </div>
  ),
};
