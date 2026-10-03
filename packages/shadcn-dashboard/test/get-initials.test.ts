import { describe, expect, it } from 'vitest';
import { getInitials } from '../src/utils/get-initials';

describe('getInitials', () => {
  it('should take the first letter of the first two words, uppercased', () => {
    expect(getInitials('jane van doe')).toBe('JV');
  });

  it('should split on dots, underscores and dashes as well as spaces', () => {
    expect(getInitials('jane.doe')).toBe('JD');
    expect(getInitials('jane_doe')).toBe('JD');
    expect(getInitials('jane-doe')).toBe('JD');
  });

  it('should return a single initial for a single word', () => {
    expect(getInitials('Jane')).toBe('J');
  });

  it('should fall back to a question mark when there is no name', () => {
    expect(getInitials(null)).toBe('?');
    expect(getInitials(undefined)).toBe('?');
    expect(getInitials('  ')).toBe('?');
  });
});
