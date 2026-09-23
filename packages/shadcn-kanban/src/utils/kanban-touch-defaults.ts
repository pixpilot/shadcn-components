/**
 * Shared touch constants.
 *
 * The sensor and the press-feedback hook have to agree on the hold duration and
 * the movement tolerance, or the ring would appear at a moment the drag does
 * not actually arm. Keeping both numbers here is what makes that guarantee
 * mechanical rather than a comment.
 */

/** Milliseconds a finger must rest on a card before the drag arms. */
export const TOUCH_ACTIVATION_DELAY = 250;

/** Pixels of movement tolerated during the hold before the press is cancelled. */
export const TOUCH_ACTIVATION_TOLERANCE = 8;

/**
 * Marks an element as an explicit drag handle, which picks up on contact
 * instead of waiting out the hold.
 */
export const DRAG_HANDLE_ATTRIBUTE = 'data-kanban-drag-handle';

/** Matches {@link DRAG_HANDLE_ATTRIBUTE} and anything inside it (e.g. an icon). */
export const DRAG_HANDLE_SELECTOR = `[${DRAG_HANDLE_ATTRIBUTE}]`;

/** Spread onto an element to turn it into a drag handle. */
export const dragHandleProps = { [DRAG_HANDLE_ATTRIBUTE]: '' } as const;
