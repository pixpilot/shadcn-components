'use client';

import type React from 'react';
import type { ProviderSignInHandlers } from './ProviderSignInButtons';

import { Separator } from '@pixpilot/shadcn';
import { MailCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { OTP_LENGTH } from '../constants/validation';
import { AuthButton, AuthPendingProvider, useAuthPendingState } from './auth-pending';
import { AuthCard } from './AuthCard';
import { EmailOtpCodeForm } from './forms/EmailOtpCodeForm';
import { EmailRequestForm } from './forms/EmailRequestForm';
import { ProviderSignInButtons } from './ProviderSignInButtons';

/**
 * Seconds before "Send a new code" becomes available again. Shorter than the
 * code's own lifetime on purpose — this exists to stop a double-click emailing
 * two codes (the second silently invalidating the first), not to ration them.
 */
const RESEND_COOLDOWN_SECONDS = 60;

/** How long the emailed code lasts, for the copy only. Supabase enforces it. */
const DEFAULT_EXPIRY_MINUTES = 60;

const MS_PER_SECOND = 1000;

/** Key for the "send a new code" button, so only it spins while resending. */
const RESEND_ACTION = 'resend';

export interface EmailOtpFormProps extends ProviderSignInHandlers {
  /** Emails a fresh code to this address. */
  onSendEmailOtp: (email: string) => Promise<void>;
  /** Verifies a typed code. Signs the user in and redirects on success. */
  onVerifyEmailOtp: (email: string, code: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  /**
   * The address a code was just sent to, or `null` while the form is still
   * collecting one. Controlled by the host: only it knows whether the server
   * action succeeded, since a failed send reports through `error` rather than
   * by rejecting.
   */
  sentTo?: string | null;
  /** Returns to the collect-an-address state, e.g. after a typo. */
  onUseDifferentEmail?: () => void;
  onSwitchToSignIn?: () => void;
  /** Stated code lifetime, in minutes. Match Supabase's `otp_expiry`. */
  expiryMinutes?: number;
  privacyPolicyUrl?: string;
  privacyNotice?: React.ReactNode;
  termsUrl?: string;
}

interface CodeEntryStepProps {
  sentTo: string;
  onVerifyEmailOtp: (email: string, code: string) => Promise<void>;
  onResend: (email: string) => Promise<void>;
  error: string | null;
  expiryMinutes: number;
  onUseDifferentEmail?: () => void;
  onSwitchToSignIn?: () => void;
}

/**
 * The second step: the code itself.
 *
 * Its own component so the parent can mount it under `key={sentTo}` — a new
 * address, or a resent code, then starts with an empty field and a fresh
 * cooldown without an effect reaching in to reset either.
 */
function CodeEntryStep({
  sentTo,
  onVerifyEmailOtp,
  onResend,
  error,
  expiryMinutes,
  onUseDifferentEmail,
  onSwitchToSignIn,
}: CodeEntryStepProps) {
  const [resendIn, setResendIn] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (resendIn <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), MS_PER_SECOND);
    return () => clearTimeout(timer);
  }, [resendIn]);

  return (
    <AuthCard title="Enter your code" error={error}>
      <div className="mb-4 flex flex-col items-center gap-3 text-center">
        <MailCheck className="text-primary h-10 w-10" aria-hidden="true" />
        <p className="text-sm">
          We sent a {OTP_LENGTH}-digit code to{' '}
          <span className="font-medium">{sentTo}</span>.
        </p>
      </div>

      <EmailOtpCodeForm
        sentTo={sentTo}
        onVerifyEmailOtp={onVerifyEmailOtp}
        expiryMinutes={expiryMinutes}
      />

      <Separator className="my-4" />

      <div className="space-y-2 text-center text-sm">
        <p>
          <AuthButton
            variant="link"
            size="sm"
            actionKey={RESEND_ACTION}
            onAction={async () => onResend(sentTo)}
            disabled={resendIn > 0}
            className="h-auto p-0"
          >
            {resendIn > 0 ? `Send a new code in ${resendIn}s` : 'Send a new code'}
          </AuthButton>
        </p>
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
  );
}

/**
 * Passwordless sign-in with a code typed back into this page.
 *
 * Two steps in one component, because they are one flow: collect an address,
 * then collect the code that address received. Keeping both here is what lets
 * "use a different email" and "send a new code" stay a single decision the
 * user makes in one place.
 *
 * Doubles as sign-up — an unknown address gets an account — so it carries the
 * same Terms line the password sign-up form does.
 */
export function EmailOtpForm({
  onSendEmailOtp,
  onVerifyEmailOtp,
  onGoogleSignIn,
  onLinkedInSignIn,
  isLoading,
  error,
  sentTo,
  onUseDifferentEmail,
  onSwitchToSignIn,
  expiryMinutes = DEFAULT_EXPIRY_MINUTES,
  privacyPolicyUrl = '/privacy',
  privacyNotice,
  termsUrl = '/terms',
}: EmailOtpFormProps) {
  /**
   * Bumped on every resend. Part of the code step's `key`, so a fresh code
   * gets a fresh field and cooldown even though `sentTo` has not changed.
   */
  const [resendCount, setResendCount] = useState(0);
  const pending = useAuthPendingState(isLoading);

  const handleResend = async (address: string) => {
    // Remount on the click, not on the response: the host may resolve without
    // changing `sentTo`, which would leave the cooldown where it was.
    setResendCount((count) => count + 1);
    return onSendEmailOtp(address);
  };

  if (sentTo != null && sentTo.length > 0) {
    return (
      <AuthPendingProvider value={pending}>
        <CodeEntryStep
          key={`${sentTo}:${resendCount}`}
          sentTo={sentTo}
          onVerifyEmailOtp={onVerifyEmailOtp}
          onResend={handleResend}
          error={error}
          expiryMinutes={expiryMinutes}
          onUseDifferentEmail={onUseDifferentEmail}
          onSwitchToSignIn={onSwitchToSignIn}
        />
      </AuthPendingProvider>
    );
  }

  return (
    <AuthPendingProvider value={pending}>
      <AuthCard
        title="Sign in with email"
        description="No password needed — we'll email you a single-use code."
        error={error}
      >
        <EmailRequestForm
          fieldId="email-otp-email"
          onSubmitEmail={onSendEmailOtp}
          submitLabel="Email me a sign-in code"
          submittingLabel="Sending code..."
          termsUrl={termsUrl}
          privacyPolicyUrl={privacyPolicyUrl}
          privacyNotice={privacyNotice}
        />

        <ProviderSignInButtons
          onGoogleSignIn={onGoogleSignIn}
          onLinkedInSignIn={onLinkedInSignIn}
          action="Sign in"
        />

        <div className="my-4" />

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
