import type { ComponentMeta } from '@internal/mcp';
import type { OverlayProviderProps } from './OverlayProvider';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `OverlayProviderProps` is a compile error until it is
// documented here.
type OverlayProviderDocumentedProps = Extract<keyof OverlayProviderProps, string>;

export const meta: ComponentMeta<OverlayProviderDocumentedProps> = {
  name: 'OverlayProvider',
  category: 'Overlays',
  description:
    'Context provider that enables imperatively shown dialogs/drawers (e.g. ConfirmationDialog). Guards against nested providers so it is safe to mount once near the app root.',
  props: defineProps<OverlayProviderDocumentedProps>({
    children: 'The application subtree that can show dialogs through the dialog helper.',
    portalContainerRef:
      'Optional ref to the element that descendant Dialog and Drawer portals should use.',
  }),
  notes: [
    'Nested providers do not mount another NiceModal store, but may set a different portalContainerRef for their descendants.',
  ],
  examples: [
    {
      title: 'App-level provider',
      code: '<OverlayProvider>\n  <App />\n</OverlayProvider>',
    },
  ],
  related: ['ConfirmationDialog', 'Dialog', 'registerDialog', 'registerDrawer', 'Drawer'],
  keywords: [
    'dialog',
    'provider',
    'modal',
    'context',
    'drawer',
    'overlay',
    'dialog-provider',
    'drawer-provider',
    'overlay-provider',
  ],
};
