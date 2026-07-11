import type { ComponentMeta } from '@internal/mcp';
import type { LoadingOverlayProps } from './LoadingOverlay';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `LoadingOverlayProps` is a compile error until it is
// documented here.
type LoadingOverlayDocumentedProps = Extract<keyof LoadingOverlayProps, string>;

export const meta: ComponentMeta<LoadingOverlayDocumentedProps> = {
  name: 'LoadingOverlay',
  category: 'Feedback',
  description:
    'A spinner overlay that fades in over its container or the full viewport while a task is loading, with optional message and show/hide delays.',
  props: defineProps<LoadingOverlayDocumentedProps>({
    show: {
      description: 'Whether the overlay is visible.',
      type: 'boolean',
    },
    backdrop: {
      description: 'Shows a semi-transparent backdrop behind the spinner.',
      type: 'boolean',
      defaultValue: 'true',
    },
    placement: {
      description: 'Vertical alignment of the loader within the overlay.',
      type: '"top" | "bottom" | "center"',
      defaultValue: '"center"',
    },
    message: 'Optional message rendered below the spinner.',
    inDelay: {
      description: 'Delay in milliseconds before showing the loader.',
      type: 'number',
      defaultValue: '0',
    },
    outDelay: {
      description:
        'Delay in milliseconds before hiding the loader after `show` becomes false.',
      type: 'number',
      defaultValue: '0',
    },
    scope: {
      description:
        'Whether the overlay fills its relative parent ("container") or the viewport ("fullscreen").',
      type: '"container" | "fullscreen"',
      defaultValue: '"container"',
    },
    size: {
      description: 'Spinner size.',
      type: '"sm" | "default" | "lg"',
      defaultValue: '"default"',
    },
    slots: 'Props forwarded to the inner spinner, message, and content elements.',
    className: 'Additional CSS class applied to the overlay wrapper.',
  }),
  examples: [
    {
      title: 'Container overlay',
      code: '<div className="relative">{content}<LoadingOverlay show={isLoading} message="Loading…" /></div>',
    },
    {
      title: 'Fullscreen overlay',
      code: '<LoadingOverlay show={isLoading} scope="fullscreen" />',
    },
  ],
  keywords: ['loading', 'overlay', 'spinner', 'busy', 'feedback'],
};
