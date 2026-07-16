import { describe, expect, it } from 'vitest';
import { isEmptyFieldValue } from '../../../src/components/overlay-common/is-empty-field-value';

describe('isEmptyFieldValue', () => {
  it('should treat null and undefined as empty', () => {
    expect(isEmptyFieldValue(null)).toBe(true);
    expect(isEmptyFieldValue(undefined)).toBe(true);
  });

  it('should treat an empty string as empty', () => {
    expect(isEmptyFieldValue('')).toBe(true);
  });

  it('should treat a non-empty string as filled', () => {
    expect(isEmptyFieldValue('London')).toBe(false);
  });

  it('should treat false and 0 as filled', () => {
    expect(isEmptyFieldValue(false)).toBe(false);
    expect(isEmptyFieldValue(0)).toBe(false);
  });

  it('should treat an object with no keys as empty', () => {
    // Formily gives an untouched object field a value of {}.
    expect(isEmptyFieldValue({})).toBe(true);
  });

  it('should treat an object whose values are all empty as empty', () => {
    expect(isEmptyFieldValue({ street: undefined, city: '' })).toBe(true);
  });

  it('should treat an object with any filled value as filled', () => {
    expect(isEmptyFieldValue({ street: '', city: 'London' })).toBe(false);
  });

  it('should treat nested empty objects as empty', () => {
    expect(isEmptyFieldValue({ address: { city: '' } })).toBe(true);
  });

  it('should treat nested filled objects as filled', () => {
    expect(isEmptyFieldValue({ address: { city: 'London' } })).toBe(false);
  });

  it('should treat empty arrays and arrays of empty values as empty', () => {
    expect(isEmptyFieldValue([])).toBe(true);
    expect(isEmptyFieldValue([{ name: '' }])).toBe(true);
  });

  it('should treat an array with any filled value as filled', () => {
    expect(isEmptyFieldValue([{ name: 'Ada' }])).toBe(false);
  });
});
