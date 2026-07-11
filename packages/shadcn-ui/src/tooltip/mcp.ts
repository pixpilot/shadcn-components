import type { ComponentMeta } from '@internal/mcp';
import { defineProps } from '@internal/mcp';

export const meta: ComponentMeta = {
  name: 'Tooltip',
  category: 'Overlays',
  description:
    'A hover/focus tooltip built on Radix, composed of TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent.',
  props: defineProps({}),
  notes: [
    'Wrap the app (or a subtree) in a single TooltipProvider to configure shared delayDuration.',
    'The Tooltip root forwards Radix props (open, defaultOpen, onOpenChange, delayDuration); TooltipContent forwards side, align, sideOffset, etc.',
  ],
  examples: [
    {
      title: 'Basic tooltip',
      code: '<TooltipProvider>\n  <Tooltip>\n    <TooltipTrigger asChild><Button variant="outline">Hover</Button></TooltipTrigger>\n    <TooltipContent>Helpful hint</TooltipContent>\n  </Tooltip>\n</TooltipProvider>',
    },
  ],
  related: ['Popover'],
  keywords: ['tooltip', 'hint', 'overlay', 'hover'],
};
