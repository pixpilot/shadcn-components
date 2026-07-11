import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ButtonExtendedProps } from './ButtonExtended';
import { defineProps } from '@internal/mcp';

type ButtonExtendedOwnProps = OwnProps<ButtonExtendedProps, 'button'>;

export const meta: ComponentMeta<ButtonExtendedOwnProps> = {
  name: 'ButtonExtended',
  category: 'Actions',
  description:
    'A button that adds a loading spinner, regular and disabled-state tooltips, and a disabled-click overlay on top of the base shadcn button.',
  htmlElement: 'button',
  props: defineProps<ButtonExtendedOwnProps>({
    variant: {
      description: 'Controls the visual button treatment.',
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      defaultValue: '"default"',
    },
    size: {
      description: 'Controls the button dimensions and icon-only sizing.',
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      defaultValue: '"default"',
    },
    asChild: {
      description:
        'Render the button behavior and styles through the child element instead of a native button.',
      type: 'boolean',
      defaultValue: 'false',
    },
    loading: {
      description: 'Shows a spinner and disables the button while a task is in progress.',
      type: 'boolean',
      defaultValue: 'false',
    },
    loaderProps:
      'Loader configuration, e.g. `{ placement: "start" | "end" | "center" }` (defaults to "end").',
    tooltip: 'Tooltip content shown on hover when the button is enabled.',
    disabledTooltip:
      'Tooltip content shown when the button is disabled, explaining why the action is unavailable.',
    onDisabledClick:
      'Called when the disabled overlay is clicked, so disabled actions can respond to interaction.',
    slots:
      'Customizes the tooltip sub-components (tooltip, trigger, content) and the loader container/node.',
  }),
  examples: [
    {
      title: 'Loading button',
      code: '<ButtonExtended loading onClick={save}>Save</ButtonExtended>',
    },
    {
      title: 'Disabled with reason',
      code: '<ButtonExtended disabled disabledTooltip="Complete required fields first">Publish</ButtonExtended>',
    },
  ],
  keywords: ['button', 'loading', 'tooltip', 'action', 'spinner'],
};
