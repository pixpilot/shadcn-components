import { registerOverlay } from '../overlay-provider';

/**
 * Registers a dialog component and returns a typed controller for it.
 *
 * The component is wrapped with NiceModal automatically and receives controlled
 * `open` and `onOpenChange` props. Props supplied as `defaultProps` become
 * optional when calling `show`.
 *
 * Usage:
 * ```ts
 * const projectDialog = registerDialog('project-dialog', ProjectDialog, { mode: 'edit' });
 * await projectDialog.show({ projectId: 'project-1' });
 * ```
 */
export const registerDialog = registerOverlay;
