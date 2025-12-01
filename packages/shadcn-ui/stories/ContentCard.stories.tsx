import type { Meta, StoryObj } from '@storybook/react';
import { ContentCard } from '../src/ContentCard';

/**
 * A content card component with optional title.
 * Wraps content in a styled card with padding and optional title.
 */
const meta = {
  title: 'shadcn-ui/ContentCard',
  component: ContentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title for the card',
    },
    marginBottom: {
      control: 'boolean',
      description: 'Adds margin bottom to the card',
    },
  },
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default content card with title
 */
export const Default: Story = {
  args: {
    title: 'Card Title',
    children: (
      <p>This is some content inside the card. It can contain any React elements.</p>
    ),
  },
};

/**
 * Content card without title
 */
export const WithoutTitle: Story = {
  args: {
    children: (
      <div>
        <p>Content without a title.</p>
        <p>Multiple paragraphs or elements can be included.</p>
      </div>
    ),
  },
};

/**
 * Content card with margin bottom
 */
export const WithMargin: Story = {
  args: {
    title: 'Card with Margin',
    marginBottom: true,
    children: <p>This card has margin bottom applied.</p>,
  },
};
