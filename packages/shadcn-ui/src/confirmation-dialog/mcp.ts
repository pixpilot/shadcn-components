import type { ComponentMeta } from '@internal/mcp';
import type { ConfirmationDialogProps } from './ConfirmationDialog';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `ConfirmationDialogProps` is a compile error until it is
// documented here.
type ConfirmationDialogDocumentedProps = Extract<keyof ConfirmationDialogProps, string>;

export const meta: ComponentMeta<ConfirmationDialogDocumentedProps> = {
  name: 'ConfirmationDialog',
  category: 'Overlays',
  description:
    'A prebuilt confirm/cancel dialog with variant styling and icon, shown imperatively via the dialog helper inside a DialogProvider.',
  props: defineProps<ConfirmationDialogDocumentedProps>({
    id: 'Optional identifier for the dialog instance used by the imperative dialog helper.',
    title: {
      description: 'Dialog heading.',
      type: 'string',
      defaultValue: '"Confirmation Dialog"',
    },
    description: 'Body text or node explaining the action being confirmed.',
    confirmText: {
      description: 'Label for the confirm button.',
      type: 'string',
      defaultValue: '"Confirm"',
    },
    cancelText: {
      description: 'Label for the cancel button.',
      type: 'string',
      defaultValue: '"Cancel"',
    },
    onConfirm: 'Called when the user confirms. The shown promise also resolves to true.',
    onCancel:
      'Called when the user cancels or dismisses. The shown promise also resolves to false.',
    variant: {
      description: 'Controls the color treatment and icon of the dialog.',
      type: '"destructive" | "warning" | "primary" | "default"',
      defaultValue: '"default"',
    },
    showIcon: {
      description:
        'Shows the variant icon next to the title (ignored for the default variant).',
      type: 'boolean',
      defaultValue: 'true',
    },
  }),
  notes: [
    'Render a DialogProvider near the app root, then show this dialog imperatively via the exported `dialog` helper.',
  ],
  examples: [
    {
      title: 'Show a confirmation',
      code: 'const ok = await dialog.show(ConfirmationDialog, { title: "Delete item?", variant: "destructive", confirmText: "Delete" });\nif (ok) deleteItem();',
    },
  ],
  related: ['Dialog', 'DialogProvider'],
  keywords: ['confirm', 'dialog', 'modal', 'confirmation', 'prompt'],
};
