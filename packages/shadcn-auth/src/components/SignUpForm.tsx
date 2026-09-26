'use client';

import type React from 'react';
import type { ProviderSignInHandlers } from './ProviderSignInButtons';

import { Separator } from '@pixpilot/shadcn';
import { Mail, MailCheck } from 'lucide-react';

import { AuthButton, AuthPendingProvider, useAuthPendingState } from './auth-pending';
import { AuthCard } from './AuthCard';
import { SignUpCredentialsForm } from './forms/SignUpCredentialsForm';
import { ProviderSignInButtons } from './ProviderSignInButtons';

export interface SignUpFormProps extends ProviderSignInHandlers {
  onSignUp: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  /** Address that has been sent a confirmation email, controlled by the host. */
  sentTo?: string | null;
  onSwitchToSignIn?: () => void;
  onSwitchToMagicLink?: () => void;
  /** Offers the emailed-code route. Hidden when the host has not wired one. */
  onSwitchToEmailOtp?: () => void;
  privacyPolicyUrl?: string;
  privacyNotice?: React.ReactNode;
  termsUrl?: string;
  /** Minimum age stated by the Terms; shown in the acceptance line. */
  minimumAge?: number;
  onConsentGiven?: () => void;
}

export function SignUpForm({
  onSignUp,
  onGoogleSignIn,
  onLinkedInSignIn,
  isLoading,
  error,
  sentTo,
  onSwitchToSignIn,
  onSwitchToMagicLink,
  onSwitchToEmailOtp,
  privacyPolicyUrl = '/privacy',
  privacyNotice,
  termsUrl = '/terms',
  minimumAge,
  onConsentGiven,
}: SignUpFormProps) {
  const pending = useAuthPendingState(isLoading);

  if (sentTo != null && sentTo.length > 0) {
    return (
      <AuthPendingProvider value={pending}>
        <AuthCard title="Check your email" error={error}>
          <div className="flex flex-col items-center gap-4 text-center">
            <MailCheck className="text-primary h-12 w-12" aria-hidden="true" />
            <p className="text-sm">
              We sent a confirmation link to <span className="font-medium">{sentTo}</span>
              .
            </p>
            <p className="text-muted-foreground text-xs">
              Open it to finish creating your account. Check your spam folder if it does
              not arrive.
            </p>
          </div>

          {onSwitchToSignIn && (
            <>
              <Separator className="my-4" />
              <div className="text-center">
                <AuthButton
                  variant="link"
                  size="sm"
                  onClick={onSwitchToSignIn}
                  className="h-auto p-0"
                >
                  Back to sign in
                </AuthButton>
              </div>
            </>
          )}
        </AuthCard>
      </AuthPendingProvider>
    );
  }

  return (
    <AuthPendingProvider value={pending}>
      <AuthCard title="Sign Up" error={error}>
        <SignUpCredentialsForm
          onSignUp={onSignUp}
          privacyPolicyUrl={privacyPolicyUrl}
          privacyNotice={privacyNotice}
          termsUrl={termsUrl}
          minimumAge={minimumAge}
          onConsentGiven={onConsentGiven}
        />

        <ProviderSignInButtons
          onGoogleSignIn={onGoogleSignIn}
          onLinkedInSignIn={onLinkedInSignIn}
          action="Sign up"
        />

        <Separator className="my-4" />

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
          {onSwitchToSignIn && (
            <p>
              Already have an account?{' '}
              <AuthButton
                variant="link"
                size="sm"
                onClick={onSwitchToSignIn}
                className="h-auto p-0"
              >
                Sign in
              </AuthButton>
            </p>
          )}
        </div>
      </AuthCard>
    </AuthPendingProvider>
  );
}
