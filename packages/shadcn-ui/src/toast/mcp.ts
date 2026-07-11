import type { ComponentMeta } from '@internal/mcp';
import type { ToastFunction } from './toast';
import { defineProps } from '@internal/mcp';

// The toast API is imperative. Derive the documented option set from the props
// accepted by the `toast(...)` call so that adding an option is a compile error
// until it is documented here.
type ToastProps = Parameters<ToastFunction>[0];
type ToastDocumentedProps = Extract<keyof ToastProps, string>;

export const meta: ComponentMeta<ToastDocumentedProps> = {
  name: 'Toast',
  category: 'Feedback',
  description:
    'An imperative toast notification API (built on sonner) with variant-styled alert toasts and dedupe/replacement per message. Mount ToastProvider once, then call toast(...).',
  props: defineProps<ToastDocumentedProps>({
    title: 'Bold heading of the toast.',
    description: 'Body message of the toast.',
    variant: {
      description: 'Controls the toast color treatment and icon.',
      type: '"error" | "info" | "warning" | "success" | "default"',
      defaultValue: '"default"',
    },
    duration: {
      description: 'How long the toast stays visible, in milliseconds.',
      type: 'number',
      defaultValue: '10000',
    },
    position:
      'Screen position for the toast (forwarded to sonner, e.g. "top-right", "bottom-center").',
    dismissible: {
      description: 'Whether the toast shows a close button and can be dismissed.',
      type: 'boolean',
      defaultValue: 'true',
    },
    id: 'Stable id used to dedupe and replace a previous toast with the same id.',
    className: 'Additional CSS class applied to the toast alert.',
    icon: {
      description: 'Custom icon element, or `false` to hide the variant icon.',
      type: 'React.JSX.Element | boolean',
    },
  }),
  notes: [
    'Render <ToastProvider /> once near the app root.',
    'Convenience helpers: toast.success, toast.error, toast.warning, toast.info, toast.custom, toast.dismiss(id), toast.dismissAll().',
  ],
  examples: [
    {
      title: 'Success toast',
      code: 'toast.success("Saved", { description: "Your changes were saved." });',
    },
    {
      title: 'Custom toast call',
      code: 'toast({ title: "Heads up", description: "Something happened", variant: "warning", duration: 5000 });',
    },
  ],
  keywords: ['toast', 'notification', 'sonner', 'alert', 'snackbar'],
};
