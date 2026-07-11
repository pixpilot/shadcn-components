import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type React from 'react';
import type { AbsoluteFill } from './AbsoluteFill';
import { defineProps } from '@internal/mcp';

type AbsoluteFillOwnProps = OwnProps<React.ComponentProps<typeof AbsoluteFill>, 'div'>;

export const meta: ComponentMeta<AbsoluteFillOwnProps> = {
  name: 'AbsoluteFill',
  category: 'Layout',
  description:
    'An absolutely positioned div stretched over its relatively positioned parent, used to capture pointer events (e.g. to enable tooltips on disabled buttons).',
  htmlElement: 'div',
  props: defineProps<AbsoluteFillOwnProps>({}),
  examples: [
    {
      title: 'Overlay for a disabled control',
      code: '<div className="relative"><Button disabled>Save</Button><AbsoluteFill onClick={explainWhy} /></div>',
    },
  ],
  keywords: ['overlay', 'absolute', 'fill', 'layout'],
};
