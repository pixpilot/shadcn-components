import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { CloseButtonRoundedProps } from './CloseButtonRounded';
import { defineProps } from '@internal/mcp';

type CloseButtonRoundedOwnProps = OwnProps<CloseButtonRoundedProps, 'button'>;

export const meta: ComponentMeta<CloseButtonRoundedOwnProps> = {
  name: 'CloseButtonRounded',
  category: 'Actions',
  description:
    'A circular icon button with an X glyph, used to dismiss dialogs, popovers, and other dismissible surfaces.',
  htmlElement: 'button',
  props: defineProps<CloseButtonRoundedOwnProps>({
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
      title: 'Dismiss button',
      code: '<CloseButtonRounded variant="ghost" onClick={close} />',
    },
  ],
  related: ['CloseButtonAbsolute'],
  keywords: ['close', 'dismiss', 'button', 'x', 'rounded'],
};
