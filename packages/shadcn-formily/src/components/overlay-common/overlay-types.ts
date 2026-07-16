import type React from 'react';
import type { SyncReactNode } from '../../types';

/**
 * The overlay itself — the `dialog` prop on DialogItem and the `popover` prop
 * on PopoverItem.
 *
 * `TSlots` differs per overlay (only a dialog has a footer), so each component
 * supplies its own slot map.
 */
export interface OverlayProps<TSlots> {
  /** Heading inside the overlay. Defaults to the field label. */
  title?: SyncReactNode;
  /** Description inside the overlay. Defaults to the field description. */
  description?: SyncReactNode;
  /** Props for the overlay's internal parts. */
  slots?: TSlots;
}

/** Slots every overlay has, whatever kind it is. */
export interface OverlayBaseSlots {
  header?: React.ComponentProps<'div'>;
  body?: React.ComponentProps<'div'>;
}
