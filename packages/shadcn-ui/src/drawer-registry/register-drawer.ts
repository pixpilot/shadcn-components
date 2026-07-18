import { registerOverlay } from '../overlay-provider';

/**
 * Registers a drawer component and returns a typed controller for it.
 *
 * The component is wrapped with NiceModal automatically and receives controlled
 * `open` and `onOpenChange` props. Props supplied as `defaultProps` become
 * optional when calling `show`.
 *
 * Usage:
 * ```ts
 * const filtersDrawer = registerDrawer('filters-drawer', FiltersDrawer, { direction: 'right' });
 * await filtersDrawer.show({ category: 'shoes' });
 * ```
 */
export const registerDrawer = registerOverlay;
