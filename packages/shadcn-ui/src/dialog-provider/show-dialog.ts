import NiceModal from '@ebay/nice-modal-react';

export type ShowDialogProps = Record<string, unknown>;

/**
 * Opens a registered dialog by id when the caller does not have its typed controller.
 *
 * This helper is intentionally generic: because it only receives a string id, it
 * cannot infer the component prop type. Prefer `registerDialog(...).show(...)`
 * when the dialog component is available in the same module.
 *
 * @param id - Dialog id that was previously registered with `registerDialog`.
 * @param props - Optional props forwarded to the registered dialog component.
 * @returns A promise that resolves with the value passed to `modal.resolve(...)`
 * inside the dialog component.
 *
 * Usage:
 * ```ts
 * await showDialog('project-dialog', {
 *   projectId: 'project-1',
 * });
 * ```
 */
export async function showDialog<TResult = unknown>(
  id: string,
  props?: ShowDialogProps,
): Promise<TResult> {
  return NiceModal.show<TResult>(id, props);
}
