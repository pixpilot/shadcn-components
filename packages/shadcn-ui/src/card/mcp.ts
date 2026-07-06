import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type React from 'react';
import type { Card } from './Card';
import { defineProps } from '@internal/mcp';

type CardOwnProps = OwnProps<React.ComponentProps<typeof Card>, 'div'>;

export const meta: ComponentMeta<CardOwnProps> = {
  name: 'Card',
  category: 'Layout',
  description:
    'Composable card primitives for grouping related content with headers, descriptions, actions, content, and footers.',
  htmlElement: 'div',
  props: defineProps<CardOwnProps>({}),
  examples: [
    {
      title: 'Complete card',
      code: '<Card><CardHeader><CardTitle>Project</CardTitle><CardDescription>Status overview</CardDescription></CardHeader><CardContent>Ready</CardContent><CardFooter>Updated today</CardFooter></Card>',
    },
  ],
  keywords: ['card', 'surface', 'layout'],
};
