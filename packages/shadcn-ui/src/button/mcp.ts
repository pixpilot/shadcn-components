import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ButtonProps } from './Button';
import { defineProps } from '@internal/mcp';

type ButtonOwnProps = OwnProps<ButtonProps, 'button'>;

export const meta: ComponentMeta<ButtonOwnProps> = {
  name: 'Button',
  category: 'Actions',
  description:
    'A shadcn button wrapper with variant styling, optional slot rendering, and disabled-click overlay support.',
  htmlElement: 'button',
  props: defineProps<ButtonOwnProps>({
    asChild: {
      description:
        'Render the button behavior and styles through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
    onDisabledClick:
      'Called when the disabled overlay is clicked, allowing disabled actions to explain why they are unavailable.',
    size: {
      description: 'Controls the button dimensions and icon-only sizing.',
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      defaultValue: '"default"',
    },
    slots:
      'Customizes tooltip-related slots and the loading indicator container or node used by the button.',
    variant: {
      description: 'Controls the visual button treatment.',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      defaultValue: '"default"',
    },
  }),
  examples: [
    {
      title: 'Default button',
      code: '<Button>Save changes</Button>',
    },
    {
      title: 'Disabled reason',
      code: '<Button disabled title="Complete required fields first" onDisabledClick={() => showHelp()}>Publish</Button>',
    },
  ],
  keywords: ['button', 'action', 'cta'],
};
