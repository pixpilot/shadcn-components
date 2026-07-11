import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ButtonGroupProps } from './ButtonGroup';
import { defineProps } from '@internal/mcp';

type ButtonGroupOwnProps = OwnProps<ButtonGroupProps, 'div'>;

export const meta: ComponentMeta<ButtonGroupOwnProps> = {
  name: 'ButtonGroup',
  category: 'Actions',
  description:
    'A container that visually joins related buttons into a single cohesive group, with optional separators and text segments.',
  htmlElement: 'div',
  props: defineProps<ButtonGroupOwnProps>({
    orientation: {
      description: 'Lays the grouped buttons out horizontally or vertically.',
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
    },
  }),
  examples: [
    {
      title: 'Grouped buttons',
      code: '<ButtonGroup>\n  <Button variant="outline">First</Button>\n  <Button variant="outline">Second</Button>\n  <Button variant="outline">Third</Button>\n</ButtonGroup>',
    },
  ],
  related: ['Button', 'ButtonExtended'],
  keywords: ['button', 'group', 'segmented', 'actions'],
};
