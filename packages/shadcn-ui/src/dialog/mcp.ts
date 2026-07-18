import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { DialogContentProps } from './Dialog';
import { defineProps } from '@internal/mcp';

// The Dialog metadata documents DialogContent, whose props extend the Radix
// DialogContent props (which extend the native `div` props). Derive from that
// type so a newly forwarded prop is a compile error until documented here.
type DialogDocumentedProps = OwnProps<DialogContentProps, 'div'>;

export const meta: ComponentMeta<DialogDocumentedProps> = {
  name: 'Dialog',
  category: 'Overlays',
  description:
    'A modal dialog composed of DialogContent, DialogHeader, DialogBody, DialogFooter, and DialogClose, with a scrollable body and an optional fullscreen content mode.',
  props: defineProps<DialogDocumentedProps>({
    fullscreen: {
      description:
        'When true, DialogContent expands to nearly fill the viewport instead of sizing to its content.',
      type: 'boolean',
      defaultValue: 'false',
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
      'Called when the Escape key is pressed; call preventDefault to keep the dialog open.',
    onPointerDownOutside:
      'Called when a pointer event occurs outside the content; call preventDefault to keep it open.',
    onFocusOutside:
      'Called when focus moves outside the content; call preventDefault to keep it open.',
    onInteractOutside:
      'Called on any interaction (pointer or focus) outside the content; call preventDefault to keep it open.',
    showCloseButton: {
      description: 'Whether to render the built-in close (×) button in the top corner.',
      type: 'boolean',
      defaultValue: 'true',
    },
    disableOutsideClick: {
      description:
        'When true, clicking or interacting outside the content does not close the dialog.',
      type: 'boolean',
      defaultValue: 'false',
    },
    container:
      'Portal container element the dialog content is rendered into (defaults to document.body).',
  }),
  notes: [
    'Compose with the Radix Dialog root, DialogTrigger, DialogTitle, and DialogDescription from the shadcn dialog primitives.',
    'DialogHeader, DialogBody, and DialogFooter accept all native <div> props; DialogContent forwards all Radix DialogContent props.',
  ],
  examples: [
    {
      title: 'Dialog with body and footer',
      code: '<Dialog>\n  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>\n  <DialogContent>\n    <DialogHeader><DialogTitle>Edit</DialogTitle></DialogHeader>\n    <DialogBody>{form}</DialogBody>\n    <DialogFooter><DialogClose asChild><Button>Save</Button></DialogClose></DialogFooter>\n  </DialogContent>\n</Dialog>',
    },
  ],
  related: ['ConfirmationDialog', 'registerDialog'],
  keywords: ['dialog', 'modal', 'overlay', 'popup'],
};
