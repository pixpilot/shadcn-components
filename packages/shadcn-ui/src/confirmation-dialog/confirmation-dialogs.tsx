import type { ConfirmationDialogProps } from './ConfirmationDialog';
import { dialog } from '../dialog-provider';
import ConfirmationDialog from './ConfirmationDialog';

interface ConfirmDialog extends ConfirmationDialogProps {}

export async function showConfirmDialog(props: ConfirmDialog): Promise<boolean> {
  // Generate unique id for each dialog instance to allow multiple dialogs at once
  const id = crypto.randomUUID();

  // Register the component with the unique ID and get typed show/hide/remove helpers
  const confirmationDialog = dialog.register(id, ConfirmationDialog);

  // Show the dialog using the unique ID
  return confirmationDialog.show<boolean>(props);
}
