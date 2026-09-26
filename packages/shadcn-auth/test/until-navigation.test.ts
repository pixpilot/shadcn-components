import { describe, expect, it, vi } from 'vitest';

import { untilNavigation } from '../src/utils/until-navigation';

describe('untilNavigation', () => {
  it('should never settle, so the form it belongs to stays submitting', async () => {
    const settled = vi.fn();

    untilNavigation().then(settled, settled).catch(settled);

    // Both a microtask drain and a macrotask turn, since a promise that
    // resolved on either would let the spinner stop before the page changes.
    await Promise.resolve();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(settled).not.toHaveBeenCalled();
  });
});
