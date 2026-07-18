import type { ShowOverlayProps } from '../overlay-provider';
import { showOverlay } from '../overlay-provider';

export type ShowDrawerProps = ShowOverlayProps;

/**
 * Opens a registered drawer by id when the caller does not have its typed
 * controller. Prefer `registerDrawer(...).show(...)` when the drawer component
 * is available in the same module.
 *
 * Usage:
 * ```ts
 * await showDrawer('filters-drawer', { category: 'shoes' });
 * ```
 */
export const showDrawer = showOverlay;
