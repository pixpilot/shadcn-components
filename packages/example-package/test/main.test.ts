import { describe, expect, it } from 'vitest';

import { name } from '../src';

describe('name', () => {
  it('should be defined', () => {
    expect(name).toBeDefined();
  });
});
