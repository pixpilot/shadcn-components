import type { ComponentMeta } from '@internal/mcp';
import type { TypeToConfirmDialogProps } from './TypeToConfirmDialog';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `TypeToConfirmDialogProps` is a compile error until it is
// documented here.
type TypeToConfirmDialogDocumentedProps = Extract<keyof TypeToConfirmDialogProps, string>;

export const meta: ComponentMeta<TypeToConfirmDialogDocumentedProps> = {
  name: 'TypeToConfirmDialog',
  category: 'Overlays',
  description:
    'A destructive confirm dialog that only enables its confirm button once the user types an exact word (e.g. DELETE). It awaits an async `onConfirm`, shows a pending state, and stays open on failure. Shown imperatively via `typeToConfirmDialog.show(...)` under an OverlayProvider.',
  props: defineProps<TypeToConfirmDialogDocumentedProps>({
    id: 'Optional base id; the input and cancel button get `-input` and `-cancel-button` suffixes.',
    title: {
      description: 'Dialog heading.',
      type: 'string',
      defaultValue: '"Are you sure?"',
    },
    description:
      'Body explaining what the action does. Rendered in a div, so lists and paragraphs are fine.',
    warning: 'Emphasised destructive-coloured line under the description.',
    confirmWord: {
      description: 'The exact text the user must type before the confirm button enables.',
      type: 'string',
    },
    confirmLabel: {
      description: 'Label above the input.',
      type: 'ReactNode',
      defaultValue: '"Type <confirmWord> to confirm:"',
    },
    confirmPlaceholder: {
      description: 'Input placeholder.',
      type: 'string',
      defaultValue: 'confirmWord',
    },
    confirmText: {
      description: 'Label for the confirm button.',
      type: 'string',
      defaultValue: '"Confirm"',
    },
    pendingText: {
      description: 'Confirm button label while `onConfirm` is pending.',
      type: 'string',
      defaultValue: '"Working..."',
    },
    cancelText: {
      description: 'Label for the cancel button.',
      type: 'string',
      defaultValue: '"Cancel"',
    },
    onConfirm:
      'Performs the action and may return a promise. The dialog closes and the shown promise resolves true once it settles; if it rejects the dialog stays open so the user can retry.',
    onCancel:
      'Called when the user cancels or dismisses. The shown promise resolves to false.',
  }),
  notes: [
    'Render an OverlayProvider near the app root, then call `typeToConfirmDialog.show(props)` (or `showTypeToConfirmDialog(props)`).',
    'Cancel and dismiss are blocked while `onConfirm` is pending.',
    'Surface errors from `onConfirm` yourself (e.g. a toast); the dialog only keeps itself open.',
  ],
  examples: [
    {
      title: 'Delete an account',
      code: "await typeToConfirmDialog.show({\n  title: 'Delete account',\n  description: 'This removes all of your data.',\n  warning: 'This action cannot be undone.',\n  confirmWord: 'DELETE',\n  confirmText: 'Delete account',\n  pendingText: 'Deleting...',\n  onConfirm: async () => deleteAccount(),\n});",
    },
  ],
  related: ['ConfirmationDialog', 'Dialog', 'registerDialog'],
  keywords: ['confirm', 'dialog', 'destructive', 'delete', 'type to confirm', 'danger'],
};
