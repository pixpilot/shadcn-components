import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type React from 'react';
import type { ShakeStyles } from './ShakeStyles';
import { defineProps } from '@internal/mcp';

type ShakeStylesOwnProps = OwnProps<React.ComponentProps<typeof ShakeStyles>, 'div'>;

export const meta: ComponentMeta<ShakeStylesOwnProps> = {
  name: 'ShakeStyles',
  category: 'Utilities',
  description:
    'A props-less component that injects the CSS keyframes for the shake animation. Render it once wherever a shake effect is needed, then apply the `pp-shake` class to the element you want to shake (e.g. to signal an invalid action).',
  props: defineProps<ShakeStylesOwnProps>({}),
  notes: [
    'Defines the `pp-shake` animation (a 220ms horizontal wobble) and the `pp-shake` class that runs it.',
    'Toggle the `pp-shake` class on the target element to trigger the animation; remove and re-add it (e.g. via `key` or a state reset) to replay.',
  ],
  examples: [
    {
      title: 'Shake an input on invalid submit',
      code: '<>\n  <ShakeStyles />\n  <Input className={invalid ? "pp-shake" : ""} />\n</>',
    },
  ],
  related: ['Input'],
  keywords: ['shake', 'animation', 'keyframes', 'wobble', 'invalid', 'styles'],
};
