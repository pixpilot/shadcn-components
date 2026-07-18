import type { ShowOverlayProps } from '../overlay-provider';
import { showOverlay } from '../overlay-provider';

export type ShowDialogProps = ShowOverlayProps;

/**
 * Opens a registered dialog by id when the caller does not have its typed
 * controller. Prefer `registerDialog(...).show(...)` when the dialog component
 * is available in the same module.
 *
 * Usage:
 * ```ts
 * await showDialog('project-dialog', { projectId: 'project-1' });
 * ```
 */
export const showDialog = showOverlay;
