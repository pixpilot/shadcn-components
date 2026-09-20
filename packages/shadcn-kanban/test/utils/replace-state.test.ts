import { describe, expect, it } from 'vitest';
import { replaceState } from '../../src/utils/replace-state';

describe('replaceState', () => {
  it('should return the next value', () => {
    expect(replaceState('current', 'next')).toBe('next');
  });

  it('should return the next reference rather than merging', () => {
    const current = [{ id: 'a' }];
    const next = [{ id: 'b' }];

    expect(replaceState(current, next)).toBe(next);
  });

  it('should pass through nullish replacements', () => {
    expect(replaceState<string | null>('current', null)).toBeNull();
  });
});
