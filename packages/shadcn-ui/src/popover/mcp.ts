import type { ComponentMeta } from '@internal/mcp';
import { defineProps } from '@internal/mcp';

export const meta: ComponentMeta = {
  name: 'Popover',
  category: 'Overlays',
  description:
    'A floating popover built on Radix, composed of Popover, PopoverTrigger, and PopoverContent, with content pre-sized to the available viewport space and a styleless PopoverContentUnstyled variant.',
  props: defineProps({}),
  examples: [
    {
      title: 'Basic popover',
      code: '<Popover>\n  <PopoverTrigger asChild><Button variant="outline">Open</Button></PopoverTrigger>\n  <PopoverContent>Popover body</PopoverContent>\n</Popover>',
    },
    {
      title: 'Unstyled content',
      code: '<Popover>\n  <PopoverTrigger>Open</PopoverTrigger>\n  <PopoverContentUnstyled>{custom}</PopoverContentUnstyled>\n</Popover>',
    },
  ],
  notes: [
    'PopoverContent forwards all Radix PopoverContent props (align, side, sideOffset, etc.).',
  ],
  related: ['Combobox', 'Tooltip'],
  keywords: ['popover', 'overlay', 'floating', 'dropdown'],
};
