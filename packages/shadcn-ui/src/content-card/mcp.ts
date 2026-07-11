import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type React from 'react';
import type { ContentCard } from './ContentCard';
import { defineProps } from '@internal/mcp';

type ContentCardOwnProps = DocumentedProps<
  React.ComponentProps<typeof ContentCard>,
  'div',
  'title'
>;

export const meta: ComponentMeta<ContentCardOwnProps> = {
  name: 'ContentCard',
  category: 'Layout',
  description:
    'A convenience card that renders an optional title header and wraps its children in card content padding.',
  htmlElement: 'div',
  props: defineProps<ContentCardOwnProps>({
    title: 'Optional heading rendered in the card header. When omitted, no header shows.',
    marginBottom: {
      description: 'Adds bottom margin below the card.',
      type: 'boolean',
    },
  }),
  examples: [
    {
      title: 'Titled content card',
      code: '<ContentCard title="Details">\n  <p>Body content</p>\n</ContentCard>',
    },
  ],
  related: ['Card'],
  keywords: ['card', 'section', 'content', 'layout'],
};
