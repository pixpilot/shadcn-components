import { overlayRegistry, useOverlay } from '../overlay-provider';

/**
 * Drawer-named facade over the generic overlay registry (`../overlay-provider`).
 * Behavior is shared with the dialog provider; only the names differ.
 */

export const useDrawer = useOverlay;

/**
 * Convenience registry facade for drawer operations.
 *
 * Use this when you prefer a single import with discoverable methods instead of
 * importing `registerDrawer`, `showDrawer`, `hideDrawer`, `removeDrawer`, and
 * `unregisterDrawer` separately.
 *
 * Usage:
 * ```ts
 * const filtersDrawer = drawer.register('filters-drawer', FiltersDrawer);
 * await filtersDrawer.show({ category: 'shoes' });
 * await drawer.show('filters-drawer', { category: 'bags' });
 * drawer.unregister('filters-drawer');
 * ```
 */
export const drawer = overlayRegistry;
