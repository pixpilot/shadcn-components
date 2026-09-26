'use client';

import type { ProviderSignInHandlers } from './ProviderSignInButtons';

import { Mail } from 'lucide-react';
import { useState } from 'react';

import { AuthButton, AuthPendingProvider, useAuthPendingState } from './auth-pending';
import { AuthCard } from './AuthCard';
import { SignInCredentialsForm } from './forms/SignInCredentialsForm';
import { ProviderSignInButtons } from './ProviderSignInButtons';

export interface SignInFormProps extends ProviderSignInHandlers {
  /** Enables the email/password form. Omit to show passwordless/OAuth choices only. */
  onSignIn?: (email: string, password: string) => Promise<void>;
  /**
   * Puts the credential fields behind a link carrying this label, instead of
   * showing them straight away.
   *
   * For a product whose sign-in is passwordless but which still has to let one
   * known account in — a store reviewer, a support login — password fields on
   * the front of the card advertise a route almost no visitor can take. Behind
   * a line of text they stay reachable by anyone told to look for them, and
   * invisible to everyone else. Omit it and the fields render as usual.
   */
  credentialsDisclosureLabel?: string;
  isLoading: boolean;
  error: string | null;
  onSwitchToSignUp?: () => void;
  onSwitchToReset?: () => void;
  /** Offers the passwordless route. Hidden when the host has not wired one. */
  onSwitchToMagicLink?: () => void;
  /** Offers the emailed-code route. Hidden when the host has not wired one. */
  onSwitchToEmailOtp?: () => void;
}

export function SignInForm({
  onSignIn,
  credentialsDisclosureLabel,
  onGoogleSignIn,
  onLinkedInSignIn,
  isLoading,
  error,
  onSwitchToSignUp,
  onSwitchToReset,
  onSwitchToMagicLink,
  onSwitchToEmailOtp,
}: SignInFormProps) {
  const pending = useAuthPendingState(isLoading);
  const [isDisclosed, setIsDisclosed] = useState(false);

  const isDisclosure = onSignIn != null && credentialsDisclosureLabel != null;
  // Without a disclosure label the fields belong on the card from the start,
  // which is how every caller that does not set one still behaves.
  const showCredentials = onSignIn != null && (!isDisclosure || isDisclosed);

  return (
    <AuthPendingProvider value={pending}>
      <AuthCard title="Sign In" error={error}>
        {showCredentials && onSignIn != null && (
          <SignInCredentialsForm onSignIn={onSignIn} />
        )}

        <ProviderSignInButtons
          onGoogleSignIn={onGoogleSignIn}
          onLinkedInSignIn={onLinkedInSignIn}
          action="Sign in"
          showSeparator={showCredentials}
        />

        <div className="my-4" />

        <div className="space-y-2 text-center text-sm">
          {onSwitchToMagicLink && (
            <AuthButton
              type="button"
              variant="outline"
              onClick={onSwitchToMagicLink}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Email me a sign-in link instead
            </AuthButton>
          )}
          {onSwitchToEmailOtp && (
            <AuthButton
              type="button"
              variant="outline"
              onClick={onSwitchToEmailOtp}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Email me a sign-in code instead
            </AuthButton>
          )}
          {onSwitchToSignUp && (
            <p>
              Don't have an account?{' '}
              <AuthButton
                variant="link"
                size="sm"
                onClick={onSwitchToSignUp}
                className="h-auto p-0"
              >
                Sign up
              </AuthButton>
            </p>
          )}
          {onSwitchToReset && (
            <p>
              <AuthButton
                variant="link"
                size="sm"
                onClick={onSwitchToReset}
                className="h-auto p-0"
              >
                Forgot your password?
              </AuthButton>
            </p>
          )}
        </div>

        {/*
          Set apart at the foot of the card by whitespace alone. Whoever this is
          for has been told to look for it, so it only has to be findable —
          giving it a rule would frame it as another equal choice, which it is
          not.
        */}
        {isDisclosure && !isDisclosed && (
          <div className="mt-8 text-center">
            <AuthButton
              variant="link"
              size="sm"
              onClick={() => setIsDisclosed(true)}
              className="text-muted-foreground h-auto p-0 text-xs font-normal"
            >
              {credentialsDisclosureLabel}
            </AuthButton>
          </div>
        )}
      </AuthCard>
    </AuthPendingProvider>
  );
}
