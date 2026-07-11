import type { ComponentMeta } from '@internal/mcp';
import type { DialogProviderProps } from './DialogProvider';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `DialogProviderProps` is a compile error until it is
// documented here.
type DialogProviderDocumentedProps = Extract<keyof DialogProviderProps, string>;

export const meta: ComponentMeta<DialogProviderDocumentedProps> = {
  name: 'DialogProvider',
  category: 'Overlays',
  description:
    'Context provider that enables imperatively shown dialogs (e.g. ConfirmationDialog). Guards against nested providers so it is safe to mount once near the app root.',
  props: defineProps<DialogProviderDocumentedProps>({
    children: 'The application subtree that can show dialogs through the dialog helper.',
  }),
  notes: [
    'Nesting a second DialogProvider is a safe no-op; the inner one passes children through.',
  ],
  examples: [
    {
      title: 'App-level provider',
      code: '<DialogProvider>\n  <App />\n</DialogProvider>',
    },
  ],
  related: ['ConfirmationDialog', 'Dialog'],
  keywords: ['dialog', 'provider', 'modal', 'context'],
};
