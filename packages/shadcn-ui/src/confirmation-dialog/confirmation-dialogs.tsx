import type { ConfirmationDialogProps } from './ConfirmationDialog';
import ConfirmationDialog from './ConfirmationDialog';

interface ConfirmDialog extends ConfirmationDialogProps {}

export async function showConfirmDialog(props: ConfirmDialog): Promise<boolean> {
  return ConfirmationDialog.show<boolean>(props);
}

export const confirmDialog = {
  show: showConfirmDialog,
  hide: ConfirmationDialog.hide,
  remove: ConfirmationDialog.remove,
};
