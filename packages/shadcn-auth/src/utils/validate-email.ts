/**
 * Validates an email the way the browser already does.
 *
 * Deliberately not a regex: every hand-rolled email pattern is wrong at the
 * edges, and the platform ships the exact validator the `type="email"` input
 * will apply anyway. This just borrows it so the form can show a message
 * before submit instead of relying on the native bubble.
 *
 * @returns An error message, or `null` when the value is acceptable.
 */
export function validateEmailValue(value: string): string | null {
  if (value.trim().length === 0) {
    return 'Email is required';
  }

  const input = document.createElement('input');
  input.type = 'email';
  input.value = value;

  return input.validity.valid ? null : 'Please enter a valid email address';
}
