import type { OverlayRegistry } from '../overlay-provider/types';
import { overlayRegistry, useOverlay } from '../overlay-provider';

export const useDialog = useOverlay;

/**
 * Convenience registry facade for dialog operations.
 *
 * Use this when you prefer a single import with discoverable methods instead of
 * importing `registerDialog`, `showDialog`, `hideDialog`, `removeDialog`, and
 * `unregisterDialog` separately.
 *
 * Usage:
 * ```ts
 * const projectDialog = dialog.register('project-dialog', ProjectDialog);
 * await projectDialog.show({ projectId: 'project-1' });
 * await dialog.show('project-dialog', { projectId: 'project-2' });
 * dialog.unregister('project-dialog');
 * ```
 */
export const dialog: OverlayRegistry = overlayRegistry;
