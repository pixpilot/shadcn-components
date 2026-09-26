import { MIN_PASSWORD_LENGTH } from '../constants/validation';

/**
 * Validates a password field against the rules both credential forms share.
 *
 * @returns An error message, or `null` when the value is acceptable.
 */
export function validatePasswordValue(value: string): string | null {
  if (!value.trim()) {
    return 'Password is required';
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }
  return null;
}
