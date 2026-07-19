import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { DrawerContentProps } from './Drawer';
import { defineProps } from '@internal/mcp';

// The Drawer metadata documents DrawerContent, whose props extend the vaul /
// Radix Dialog content props (which extend the native `div` props). Derive from
// that type so a newly forwarded prop is a compile error until documented here.
type DrawerDocumentedProps = OwnProps<DrawerContentProps, 'div'>;

export const meta: ComponentMeta<DrawerDocumentedProps> = {
  name: 'Drawer',
  category: 'Overlays',
  description:
    'An edge-anchored overlay ("drawer") composed of DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, and DrawerClose, with a scrollable body. Pulled from the shadcn registry — built on `vaul` (which wraps the Radix Dialog primitive) for a smooth spring animation and drag-to-dismiss. Anchors to the bottom edge by default with a drag handle.',
  props: defineProps<DrawerDocumentedProps>({
    floating: {
      description:
        'Detach the drawer from the viewport edges: adds a gap on every side and rounds all corners so it reads as a floating card rather than a panel flush to the edge. Works for any `direction`.',
      type: 'boolean',
      defaultValue: 'false',
    },
    showCloseButton: {
      description:
        'Render the built-in close button in the drawer content so consumers do not need to place one manually for common layouts.',
      type: 'boolean',
      defaultValue: 'true',
    },
    asChild: {
      description:
        'Merge behavior and styles onto the child element instead of the default content wrapper.',
      type: 'boolean',
      defaultValue: 'false',
    },
    forceMount:
      'Forces the content to render even when closed, so its mount can be controlled externally (e.g. for animations).',
    onOpenAutoFocus:
      'Called when focus moves into the content on open; call preventDefault to opt out of autofocus.',
    onCloseAutoFocus:
      'Called when focus returns to the trigger on close; call preventDefault to opt out.',
    onEscapeKeyDown:
      'Called when the Escape key is pressed; call preventDefault to keep the drawer open.',
    onPointerDownOutside:
      'Called when a pointer event occurs outside the content; call preventDefault to keep it open.',
    onFocusOutside:
      'Called when focus moves outside the content; call preventDefault to keep it open.',
    onInteractOutside:
      'Called on any interaction (pointer or focus) outside the content; call preventDefault to keep it open.',
  }),
  notes: [
    'Compose with the Drawer root, DrawerTrigger, DrawerTitle, and DrawerDescription from the shadcn drawer primitives.',
    'The anchored edge is set with the `direction` prop on the Drawer root (`top | bottom | left | right`, default `bottom`) — not on DrawerContent. The drag handle only shows for the bottom direction.',
    'DrawerHeader, DrawerBody, and DrawerFooter accept all native <div> props; DrawerContent forwards all vaul/Radix Dialog content props.',
  ],
  examples: [
    {
      title: 'Drawer with body and footer',
      code: '<Drawer>\n  <DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>\n  <DrawerContent>\n    <DrawerHeader><DrawerTitle>Edit</DrawerTitle></DrawerHeader>\n    <DrawerBody>{form}</DrawerBody>\n    <DrawerFooter><DrawerClose asChild><Button>Save</Button></DrawerClose></DrawerFooter>\n  </DrawerContent>\n</Drawer>',
    },
    {
      title: 'Right-side drawer',
      code: '<Drawer direction="right">\n  <DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>\n  <DrawerContent>{/* ... */}</DrawerContent>\n</Drawer>',
    },
  ],
  related: ['Dialog', 'ConfirmationDialog', 'registerDrawer'],
  keywords: ['drawer', 'sheet', 'overlay', 'panel', 'bottom-sheet', 'vaul'],
};
