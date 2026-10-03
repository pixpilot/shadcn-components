import type { TypeToConfirmDialogProps } from './TypeToConfirmDialog';
import TypeToConfirmDialog from './TypeToConfirmDialog';

/**
 * Opens the type-to-confirm dialog. Resolves `true` once `onConfirm` has
 * settled, `false` when the user cancels or dismisses.
 */
export async function showTypeToConfirmDialog(
  props: TypeToConfirmDialogProps,
): Promise<boolean> {
  return TypeToConfirmDialog.show<boolean>(props);
}

export const typeToConfirmDialog = {
  show: showTypeToConfirmDialog,
  hide: TypeToConfirmDialog.hide,
  remove: TypeToConfirmDialog.remove,
};
