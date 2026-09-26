'use client';

import { Separator } from '@pixpilot/shadcn';
import { MailCheck } from 'lucide-react';

import { AuthButton, AuthPendingProvider, useAuthPendingState } from './auth-pending';
import { AuthCard } from './AuthCard';
import { EmailRequestForm } from './forms/EmailRequestForm';

export interface ResetPasswordFormProps {
  onResetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  /** Address that has been sent a recovery link, controlled by the host. */
  sentTo?: string | null;
  onSwitchToSignIn?: () => void;
}

export function ResetPasswordForm({
  onResetPassword,
  isLoading,
  error,
  sentTo,
  onSwitchToSignIn,
}: ResetPasswordFormProps) {
  const pending = useAuthPendingState(isLoading);

  if (sentTo != null && sentTo.length > 0) {
    return (
      <AuthPendingProvider value={pending}>
        <AuthCard title="Check your email" error={error}>
          <div className="flex flex-col items-center gap-4 text-center">
            <MailCheck className="text-primary h-12 w-12" aria-hidden="true" />
            <p className="text-sm">
              We sent a password-reset link to{' '}
              <span className="font-medium">{sentTo}</span>.
            </p>
            <p className="text-muted-foreground text-xs">
              The link works once and expires shortly. Check your spam folder if it does
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
      <AuthCard title="Reset Password" error={error}>
        <EmailRequestForm
          fieldId="reset-email"
          onSubmitEmail={onResetPassword}
          submitLabel="Send Reset Email"
          submittingLabel="Sending Reset Email..."
        />

        <div className="mt-4 text-center">
          {onSwitchToSignIn && (
            <p className="text-sm">
              <AuthButton
                variant="link"
                size="sm"
                onClick={onSwitchToSignIn}
                className="min-w-0 p-0 font-medium"
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
