import NiceModal, { unregister, useModal as useNiceModal } from '@ebay/nice-modal-react';
import { registerDialog } from './register-dialog';
import { showDialog } from './show-dialog';

export const createDialog = NiceModal.create;
export const useDialog = useNiceModal;

/**
 * Hides a registered dialog by id.
 *
 * Use this when the caller only knows the dialog id. If you already have the
 * controller returned by `dialog.register(...)`, prefer `controller.hide()`.
 *
 * @param id - Dialog id that was previously registered.
 * @returns A promise from NiceModal that resolves after the hide action is
 * dispatched.
 *
 * Usage:
 * ```ts
 * await hideDialog('project-dialog');
 * ```
 */
export async function hideDialog<TResult = unknown>(id: string): Promise<TResult> {
  return NiceModal.hide<TResult>(id);
}

/**
 * Removes a registered dialog instance from the NiceModal render tree by id.
 *
 * This does not unregister the dialog component; it only removes the mounted
 * instance from the modal tree.
 *
 * @param id - Dialog id that was previously registered.
 * Usage:
 * ```ts
 * removeDialog('project-dialog');
 * ```
 */
export function removeDialog(id: string): void {
  NiceModal.remove(id);
}

/**
 * Unregisters a dialog component by id.
 *
 * Use this when a registered dialog should no longer be available through
 * `showDialog(...)` or `dialog.show(...)`.
 *
 * @param id - Dialog id that was previously registered.
 * Usage:
 * ```ts
 * unregisterDialog('project-dialog');
 * ```
 */
export function unregisterDialog(id: string): void {
  unregister(id);
}

export interface DialogRegistry {
  /**
   * Registers a dialog component and returns a typed controller.
   *
   * @returns A controller with `id`, `show`, `hide`, and `remove`.
   *
   * Usage:
   * ```ts
   * const projectDialog = dialog.register('project-dialog', ProjectDialog);
   * ```
   */
  register: typeof registerDialog;

  /**
   * Creates a custom NiceModal dialog component.
   *
   * Use this for dialogs that need to control `useDialog()` directly. For simple
   * shadcn dialogs, prefer `dialog.register(...)`.
   *
   * Usage:
   * ```ts
   * const CustomDialog = dialog.create((props) => {
   *   const modal = dialog.useDialog();
   *   return <Dialog open={modal.visible} onOpenChange={(open) => !open && modal.hide()} />;
   * });
   * ```
   */
  create: typeof createDialog;

  /**
   * Shows a registered dialog by id with generic props.
   *
   * @returns A promise resolved by the dialog component.
   *
   * Usage:
   * ```ts
   * await dialog.show('project-dialog', { projectId: 'project-1' });
   * ```
   */
  show: typeof showDialog;

  /**
   * Hides a registered dialog by id.
   *
   * @returns A promise from NiceModal after the hide action is dispatched.
   *
   * Usage:
   * ```ts
   * await dialog.hide('project-dialog');
   * ```
   */
  hide: typeof hideDialog;

  /**
   * Removes a registered dialog instance from the render tree by id.
   *
   * @returns Nothing.
   *
   * Usage:
   * ```ts
   * dialog.remove('project-dialog');
   * ```
   */
  remove: typeof removeDialog;

  /**
   * Unregisters a dialog component by id.
   *
   * @returns Nothing.
   *
   * Usage:
   * ```ts
   * dialog.unregister('project-dialog');
   * ```
   */
  unregister: typeof unregisterDialog;

  useDialog: typeof useDialog;
}

/**
 * Convenience registry facade for dialog operations.
 *
 * Use this when you prefer a single import with discoverable methods instead of
 * importing `registerDialog`, `showDialog`, `hideDialog`, `removeDialog`, and
 * `unregisterDialog` separately.
 *
 * @returns An object of dialog helper functions.
 *
 * Usage:
 * ```ts
 * const projectDialog = dialog.register('project-dialog', ProjectDialog);
 * await projectDialog.show({ projectId: 'project-1' });
 * await dialog.show('project-dialog', { projectId: 'project-2' });
 * dialog.unregister('project-dialog');
 * ```
 */
export const dialog: DialogRegistry = {
  create: createDialog,
  hide: hideDialog,
  register: registerDialog,
  remove: removeDialog,
  show: showDialog,
  unregister: unregisterDialog,
  useDialog,
};
