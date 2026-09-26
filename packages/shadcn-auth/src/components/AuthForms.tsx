'use client';

import type React from 'react';

import type { ProviderSignInHandlers } from './ProviderSignInButtons';

import { useState } from 'react';

import { EmailOtpForm } from './EmailOtpForm';
import { MagicLinkForm } from './MagicLinkForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

/** Steps the screen can show. Which are reachable depends on the handlers given. */
export type AuthMode = 'signin' | 'signup' | 'reset' | 'magic-link' | 'email-otp';

export interface AuthFormsProps extends ProviderSignInHandlers {
  /** Pass both credential handlers to enable email/password authentication. */
  onSignIn?: (email: string, password: string) => Promise<void>;
  onSignUp?: (email: string, password: string) => Promise<void>;
  /**
   * Hides the sign-in credential fields behind a link carrying this label. Only
   * affects the sign-in step; see `SignInForm` for when that is worth doing.
   */
  credentialsDisclosureLabel?: string;
  /** Enables the "Forgot your password?" step. Omit to hide it. */
  onResetPassword?: (email: string) => Promise<void>;
  /** Enables the passwordless step. Omit to hide it. */
  onSendMagicLink?: (email: string) => Promise<void>;
  /**
   * Pass both to enable the emailed-code step. It is offered ahead of the
   * magic link when the host wires both, since the two share one Supabase
   * template and only one of them can be what the mail actually carries.
   */
  onSendEmailOtp?: (email: string) => Promise<void>;
  onVerifyEmailOtp?: (email: string, code: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  /** Address a magic link was just sent to; switches that step to its receipt. */
  magicLinkSentTo?: string | null;
  /** Address a sign-in code was just sent to; switches that step to code entry. */
  emailOtpSentTo?: string | null;
  /** Stated lifetime of an emailed code, in minutes. Match Supabase's `otp_expiry`. */
  emailOtpExpiryMinutes?: number;
  /** Address a recovery link was just sent to; switches that step to its receipt. */
  resetPasswordSentTo?: string | null;
  /** Address a signup confirmation was just sent to; switches that step to its receipt. */
  signupConfirmationSentTo?: string | null;
  /** Step to open on. Default `'signin'`. */
  initialMode?: AuthMode;
  /**
   * Fired on every step change, including "use a different email" returning to
   * the passwordless step it is already on. Hosts use it to reset the state
   * they own — the error banner and `magicLinkSentTo` — since copy from the
   * step you just left has no business on the next one.
   */
  onModeChange?: (mode: AuthMode) => void;
  /** Product name or logo shown above the card. */
  title?: React.ReactNode;
  /** Optional legal or support links shown below the active form. */
  footer?: React.ReactNode;
  privacyPolicyUrl?: string;
  /** Notice shown on every account-creation path; include a policy link in the node. */
  privacyNotice?: React.ReactNode;
  termsUrl?: string;
  minimumAge?: number;
  onConsentGiven?: () => void;
}

/**
 * The whole signed-out screen: every step, and the switching between them.
 *
 * Steps appear only when the host passed a handler for them, so this same
 * component covers a password-only app and one with OAuth plus magic links
 * without any configuration flags of its own.
 */
export function AuthForms({
  onSignIn,
  onSignUp,
  credentialsDisclosureLabel,
  onResetPassword,
  onSendMagicLink,
  onSendEmailOtp,
  onVerifyEmailOtp,
  onGoogleSignIn,
  onLinkedInSignIn,
  isLoading,
  error,
  magicLinkSentTo,
  emailOtpSentTo,
  emailOtpExpiryMinutes,
  resetPasswordSentTo,
  signupConfirmationSentTo,
  initialMode = 'signin',
  onModeChange,
  title,
  footer,
  privacyPolicyUrl,
  privacyNotice,
  termsUrl,
  minimumAge,
  onConsentGiven,
}: AuthFormsProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const emailPasswordAuthEnabled = onSignIn != null && onSignUp != null;

  const switchTo = (next: AuthMode) => () => {
    setMode(next);
    onModeChange?.(next);
  };

  const providers: ProviderSignInHandlers = { onGoogleSignIn, onLinkedInSignIn };
  const emailOtpEnabled = onSendEmailOtp != null && onVerifyEmailOtp != null;
  const emailOtpSwitch = emailOtpEnabled ? switchTo('email-otp') : undefined;
  /*
   * One passwordless offer, not two. Supabase builds both emails from the same
   * magic-link template, so whichever one the template is written for is the
   * only one that arrives usable — offering the other would send the user to
   * an inbox with nothing they can act on.
   */
  const magicLinkSwitch =
    emailOtpEnabled || onSendMagicLink == null ? undefined : switchTo('magic-link');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {title != null && (
          <h1 className="mb-6 text-center text-3xl font-bold">{title}</h1>
        )}

        {mode === 'signin' && (
          <SignInForm
            {...providers}
            onSignIn={onSignIn}
            credentialsDisclosureLabel={credentialsDisclosureLabel}
            isLoading={isLoading}
            error={error}
            onSwitchToSignUp={emailPasswordAuthEnabled ? switchTo('signup') : undefined}
            onSwitchToReset={
              emailPasswordAuthEnabled && onResetPassword != null
                ? switchTo('reset')
                : undefined
            }
            onSwitchToMagicLink={magicLinkSwitch}
            onSwitchToEmailOtp={emailOtpSwitch}
          />
        )}

        {mode === 'signup' && emailPasswordAuthEnabled && (
          <SignUpForm
            {...providers}
            onSignUp={onSignUp}
            isLoading={isLoading}
            error={error}
            sentTo={signupConfirmationSentTo}
            onSwitchToSignIn={switchTo('signin')}
            onSwitchToMagicLink={magicLinkSwitch}
            onSwitchToEmailOtp={emailOtpSwitch}
            privacyPolicyUrl={privacyPolicyUrl}
            privacyNotice={privacyNotice}
            termsUrl={termsUrl}
            minimumAge={minimumAge}
            onConsentGiven={onConsentGiven}
          />
        )}

        {mode === 'reset' && onResetPassword != null && (
          <ResetPasswordForm
            onResetPassword={onResetPassword}
            isLoading={isLoading}
            error={error}
            sentTo={resetPasswordSentTo}
            onSwitchToSignIn={switchTo('signin')}
          />
        )}

        {mode === 'magic-link' && onSendMagicLink != null && (
          <MagicLinkForm
            {...providers}
            onSendMagicLink={onSendMagicLink}
            isLoading={isLoading}
            error={error}
            sentTo={magicLinkSentTo}
            onUseDifferentEmail={switchTo('magic-link')}
            onSwitchToSignIn={switchTo('signin')}
            privacyPolicyUrl={privacyPolicyUrl}
            privacyNotice={privacyNotice}
            termsUrl={termsUrl}
          />
        )}

        {mode === 'email-otp' && emailOtpEnabled && (
          <EmailOtpForm
            {...providers}
            onSendEmailOtp={onSendEmailOtp}
            onVerifyEmailOtp={onVerifyEmailOtp}
            isLoading={isLoading}
            error={error}
            sentTo={emailOtpSentTo}
            expiryMinutes={emailOtpExpiryMinutes}
            onUseDifferentEmail={switchTo('email-otp')}
            onSwitchToSignIn={emailPasswordAuthEnabled ? switchTo('signin') : undefined}
            privacyPolicyUrl={privacyPolicyUrl}
            privacyNotice={privacyNotice}
            termsUrl={termsUrl}
          />
        )}

        {footer != null && (
          <footer className="text-muted-foreground mt-6 flex items-center justify-center gap-3 text-sm">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
