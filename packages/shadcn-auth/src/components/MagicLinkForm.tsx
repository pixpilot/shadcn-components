'use client';

import type React from 'react';
import type { ProviderSignInHandlers } from './ProviderSignInButtons';

import { Separator } from '@pixpilot/shadcn';
import { MailCheck } from 'lucide-react';

import { AuthButton, AuthPendingProvider, useAuthPendingState } from './auth-pending';
import { AuthCard } from './AuthCard';
import { EmailRequestForm } from './forms/EmailRequestForm';
import { ProviderSignInButtons } from './ProviderSignInButtons';

export interface MagicLinkFormProps extends ProviderSignInHandlers {
  onSendMagicLink: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  /**
   * The address a link was just sent to, or `null` while the form is still
   * collecting one. Controlled by the host: only it knows whether the server
   * action succeeded, since a failed send reports through `error` rather than
   * by rejecting.
   */
  sentTo?: string | null;
  /** Returns to the collect-an-address state, e.g. after a typo. */
  onUseDifferentEmail?: () => void;
  onSwitchToSignIn?: () => void;
  privacyPolicyUrl?: string;
  privacyNotice?: React.ReactNode;
  termsUrl?: string;
}

/**
 * Passwordless sign-in: type an address, receive a single-use link.
 *
 * Doubles as sign-up — an unknown address gets an account — so it carries the
 * same Terms line the password sign-up form does. There is no separate
 * confirmation step to hang a checkbox on, so acceptance is stated inline
 * against the button that performs it.
 */
export function MagicLinkForm({
  onSendMagicLink,
  onGoogleSignIn,
  onLinkedInSignIn,
  isLoading,
  error,
  sentTo,
  onUseDifferentEmail,
  onSwitchToSignIn,
  privacyPolicyUrl = '/privacy',
  privacyNotice,
  termsUrl = '/terms',
}: MagicLinkFormProps) {
  const pending = useAuthPendingState(isLoading);

  if (sentTo != null && sentTo.length > 0) {
    return (
      <AuthPendingProvider value={pending}>
        <AuthCard title="Check your email" error={error}>
          <div className="flex flex-col items-center gap-4 text-center">
            <MailCheck className="text-primary h-12 w-12" aria-hidden="true" />
            <p className="text-sm">
              We sent a sign-in link to <span className="font-medium">{sentTo}</span>.
              Open it in this browser to finish signing in.
            </p>
            <p className="text-muted-foreground text-xs">
              The link works once and expires shortly. Check your spam folder if it does
              not arrive.
            </p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-center text-sm">
            {onUseDifferentEmail && (
              <p>
                <AuthButton
                  variant="link"
                  size="sm"
                  onClick={onUseDifferentEmail}
                  className="h-auto p-0"
                >
                  Use a different email
                </AuthButton>
              </p>
            )}
            {onSwitchToSignIn && (
              <p>
                <AuthButton
                  variant="link"
                  size="sm"
                  onClick={onSwitchToSignIn}
                  className="h-auto p-0"
                >
                  Back to sign in
                </AuthButton>
              </p>
            )}
          </div>
        </AuthCard>
      </AuthPendingProvider>
    );
  }

  return (
    <AuthPendingProvider value={pending}>
      <AuthCard
        title="Sign in with email"
        description="No password needed — we'll email you a single-use link."
        error={error}
      >
        <div className="space-y-3">
          <EmailRequestForm
            fieldId="magic-link-email"
            onSubmitEmail={onSendMagicLink}
            submitLabel="Email me a sign-in link"
            submittingLabel="Sending link..."
            termsUrl={termsUrl}
            privacyPolicyUrl={privacyPolicyUrl}
            privacyNotice={privacyNotice}
          />

          <ProviderSignInButtons
            onGoogleSignIn={onGoogleSignIn}
            onLinkedInSignIn={onLinkedInSignIn}
            action="Sign in"
          />
        </div>

        <Separator className="my-4" />

        <div className="text-center text-sm">
          {onSwitchToSignIn && (
            <p>
              <AuthButton
                variant="link"
                size="sm"
                onClick={onSwitchToSignIn}
                className="h-auto p-0"
              >
                Sign in with a password instead
              </AuthButton>
            </p>
          )}
        </div>
      </AuthCard>
    </AuthPendingProvider>
  );
}
