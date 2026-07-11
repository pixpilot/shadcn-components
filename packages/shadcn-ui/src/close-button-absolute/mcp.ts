import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { PopoverCloseButtonProps } from './CloseButtonAbsolute';
import { defineProps } from '@internal/mcp';

type CloseButtonAbsoluteOwnProps = OwnProps<PopoverCloseButtonProps, 'button'>;

export const meta: ComponentMeta<CloseButtonAbsoluteOwnProps> = {
  name: 'CloseButtonAbsolute',
  category: 'Actions',
  description:
    'A rounded X close button positioned absolutely in the top-right corner of its relatively positioned parent surface.',
  htmlElement: 'button',
  props: defineProps<CloseButtonAbsoluteOwnProps>({
    variant: {
      description: 'Controls the visual button treatment inherited from the base button.',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
    },
    size: {
      description: 'Controls the button dimensions inherited from the base button.',
      type: '"default" | "sm" | "lg" | "icon"',
    },
    asChild: {
      description:
        'Render the button behavior through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Close button in a card',
      code: '<div className="relative"><CloseButtonAbsolute onClick={close} />{content}</div>',
    },
  ],
  related: ['CloseButtonRounded'],
  keywords: ['close', 'dismiss', 'absolute', 'corner', 'x'],
};
