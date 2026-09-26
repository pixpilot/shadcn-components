'use client';

import { AuthPendingProvider, useAuthPendingState } from './auth-pending';
import { AuthCard } from './AuthCard';
import { CompleteProfileFields } from './forms/CompleteProfileFields';

export interface CompleteProfileFormProps {
  onSubmit: (name: string) => Promise<void>;
  /** The host's server-enforced display name limit. */
  maxDisplayNameLength: number;
  isLoading: boolean;
  error: string | null;
  /** Address the account was created with, shown so the user knows who they are. */
  email?: string | null;
  /** Prefill, when some provider supplied a partial name. */
  defaultName?: string | null;
}

/**
 * Asks for the one thing a magic link cannot tell us.
 *
 * An emailed link proves an address and nothing else, so an account created
 * that way has no name to greet anyone by. This is the step that fills the gap,
 * and it sits *before* the post-sign-in redirect — once the Chrome extension has
 * its authorization code the sign-in is over and there is nowhere left to ask.
 */
export function CompleteProfileForm({
  onSubmit,
  maxDisplayNameLength,
  isLoading,
  error,
  email,
  defaultName,
}: CompleteProfileFormProps) {
  const pending = useAuthPendingState(isLoading);

  return (
    <AuthPendingProvider value={pending}>
      <AuthCard
        title="What should we call you?"
        description={
          email != null && email.length > 0
            ? `Finishing sign-in for ${email}.`
            : 'One last step before you continue.'
        }
        error={error}
      >
        <CompleteProfileFields
          onSubmit={onSubmit}
          maxDisplayNameLength={maxDisplayNameLength}
          defaultName={defaultName}
        />
      </AuthCard>
    </AuthPendingProvider>
  );
}
