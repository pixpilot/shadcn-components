import type {
  createOverlay,
  hideOverlay,
  registerOverlay,
  removeOverlay,
  showOverlay,
  unregisterOverlay,
  useOverlay,
} from './overlay-registry';

export interface OverlayRegistry {
  /** Registers an overlay component and returns a typed controller. */
  register: typeof registerOverlay;
  /** Creates a custom NiceModal overlay component with controller helpers. */
  create: typeof createOverlay;
  /** Shows a registered overlay by id with generic props. */
  show: typeof showOverlay;
  /** Hides a registered overlay by id. */
  hide: typeof hideOverlay;
  /** Removes a registered overlay instance from the render tree by id. */
  remove: typeof removeOverlay;
  /** Unregisters an overlay component by id. */
  unregister: typeof unregisterOverlay;
  use: typeof useOverlay;
}
