import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { AlertProps } from './Alert';
import { defineProps } from '@internal/mcp';

// `title` is stripped by OwnProps because it is also a native attribute, so it
// is re-added explicitly since Alert uses it as the heading.
type AlertOwnProps = DocumentedProps<AlertProps, 'div', 'title'>;

export const meta: ComponentMeta<AlertOwnProps> = {
  name: 'Alert',
  category: 'Feedback',
  description:
    'A variant-styled alert box with an optional leading icon, title, and description used to surface contextual status messages.',
  htmlElement: 'div',
  props: defineProps<AlertOwnProps>({
    variant: {
      description: 'Controls the color treatment and default icon of the alert.',
      type: '"error" | "info" | "warning" | "success" | "default"',
      defaultValue: '"default"',
    },
    title: 'Bold heading shown above the description.',
    description: 'Main message content rendered below the title.',
    duration:
      'Optional auto-dismiss duration in milliseconds, used by toast-style usage.',
    icon: {
      description:
        'Leading icon. Pass a JSX element for a custom icon, true for the variant default, or false to hide it.',
      type: 'React.JSX.Element | boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Success alert',
      code: '<Alert variant="success" title="Saved" description="Your changes have been saved." icon />',
    },
    {
      title: 'Alert with custom content',
      code: '<Alert variant="warning" title="Heads up">\n  <Button size="sm">Review</Button>\n</Alert>',
    },
  ],
  keywords: ['alert', 'notification', 'message', 'feedback', 'banner'],
};
