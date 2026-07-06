import { describe, expect, it } from 'vitest';

import { defineProps } from '../src';

describe('defineProps', () => {
  it('returns the provided prop metadata', () => {
    const props = {
      disabled: 'Disables interactions.',
    };

    expect(defineProps(props)).toBe(props);
  });
});
