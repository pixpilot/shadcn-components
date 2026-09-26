/**
 * Client-side form limits.
 *
 * These mirror rules the server enforces independently — the forms check them
 * so the user gets an answer without a round trip, never so the server can skip
 * checking. Server-owned limits are passed to components by the host so client
 * feedback stays aligned with the server's rules.
 */
/** Matches Supabase's own `minimum_password_length` default. */
export const MIN_PASSWORD_LENGTH = 6;

/** Age stated by the default Terms copy on the sign-up form. */
export const DEFAULT_MINIMUM_AGE = 16;

/** Digits Supabase's `otp_length` is configured to emit. */
export const OTP_LENGTH = 6;
