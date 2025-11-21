import type { ConfirmationDialogProps } from './ConfirmationDialog';
import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog from './ConfirmationDialog';

interface ConfirmDialog extends ConfirmationDialogProps {}

export async function showConfirmDialog(props: ConfirmDialog): Promise<boolean> {
  // Generate unique id for each dialog instance to allow multiple dialogs at once
  const id = crypto.randomUUID();

  // Register the component with the unique ID
  NiceModal.register(id, ConfirmationDialog);

  // Show the dialog using the unique ID
  return NiceModal.show(id, props);
}
// You can call handleDelete from anywhere, including inside other dialogs
