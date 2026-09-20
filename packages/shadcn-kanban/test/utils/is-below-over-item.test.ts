import type { ClientRect, DragOverEvent } from '@dnd-kit/core';

import { describe, expect, it } from 'vitest';
import { isBelowOverItem } from '../../src/utils/is-below-over-item';

function rect(top: number, height = 50): ClientRect {
  return {
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 100,
    width: 100,
  };
}

/**
 * Builds a drag event carrying only the rects the helper reads. The partial
 * shapes are deliberate: the handlers are called directly in tests and by
 * consumers, so malformed events must not throw.
 */
function dragEvent(
  activeRect: ClientRect | null | undefined,
  overRect: ClientRect | undefined,
  options: { omitRect?: boolean; nullCurrent?: boolean } = {},
): DragOverEvent {
  const { omitRect = false, nullCurrent = false } = options;
  const active = omitRect
    ? { id: 'active' }
    : {
        id: 'active',
        rect: { current: nullCurrent ? null : { translated: activeRect } },
      };

  return {
    active,
    over: overRect === undefined ? null : { id: 'over', rect: overRect },
  } as unknown as DragOverEvent;
}

describe('isBelowOverItem', () => {
  it('should be true once the dragged card clears the hovered card', () => {
    expect(isBelowOverItem(dragEvent(rect(151), rect(100)))).toBe(true);
  });

  it('should be false while the dragged card overlaps the hovered card', () => {
    expect(isBelowOverItem(dragEvent(rect(120), rect(100)))).toBe(false);
  });

  it('should be false exactly on the hovered card bottom edge', () => {
    expect(isBelowOverItem(dragEvent(rect(150), rect(100)))).toBe(false);
  });

  it('should be false when the dragged card sits above the hovered card', () => {
    expect(isBelowOverItem(dragEvent(rect(10), rect(100)))).toBe(false);
  });

  it('should be false when there is no drop target', () => {
    expect(isBelowOverItem(dragEvent(rect(200), undefined))).toBe(false);
  });

  it('should be false when the dragged card has no translated rect', () => {
    expect(isBelowOverItem(dragEvent(null, rect(100)))).toBe(false);
  });

  it('should be false when the measured rect has not been populated', () => {
    expect(isBelowOverItem(dragEvent(null, rect(100), { nullCurrent: true }))).toBe(
      false,
    );
  });

  it('should be false when the event carries no rect at all', () => {
    expect(isBelowOverItem(dragEvent(null, rect(100), { omitRect: true }))).toBe(false);
  });
});
