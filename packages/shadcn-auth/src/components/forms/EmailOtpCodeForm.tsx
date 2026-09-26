'use client';

import type React from 'react';

import { useState } from 'react';

import { OTP_LENGTH } from '../../constants/validation';
import { AUTH_SUBMIT_ACTION, AuthButton, useAuthPending } from '../auth-pending';
import { AuthField } from './AuthField';

const DIGITS_ONLY = /^\d+$/u;

const NON_DIGITS = /\D/gu;

export interface EmailOtpCodeFormProps {
  /** Address the code was sent to; submitted alongside the code. */
  sentTo: string;
  onVerifyEmailOtp: (email: string, code: string) => Promise<void>;
  /** Stated code lifetime, in minutes, for the copy under the field. */
  expiryMinutes: number;
}

/** The code-entry half of the emailed-code card. */
export function EmailOtpCodeForm({
  sentTo,
  onVerifyEmailOtp,
  expiryMinutes,
}: EmailOtpCodeFormProps) {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const pending = useAuthPending();
  const isSubmitting = pending.pendingKey === AUTH_SUBMIT_ACTION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = code.trim();
    if (trimmed.length === 0) {
      setCodeError('Enter the code from your email');
      return;
    }
    if (trimmed.length !== OTP_LENGTH || !DIGITS_ONLY.test(trimmed)) {
      setCodeError(`The code is ${OTP_LENGTH} digits`);
      return;
    }

    setCodeError('');
    pending.run(AUTH_SUBMIT_ACTION, async () => onVerifyEmailOtp(sentTo, trimmed));
  };

  return (
    /* See the `noValidate` note on the sign-in credentials form. */
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthField
        id="email-otp-code"
        label="Sign-in code"
        // `one-time-code` is what lets iOS and Android offer the code straight
        // from the notification instead of a trip to the inbox.
        autoComplete="one-time-code"
        inputMode="numeric"
        autoFocus
        maxLength={OTP_LENGTH}
        placeholder={'0'.repeat(OTP_LENGTH)}
        value={code}
        onChange={(e) => {
          setCode(e.target.value.replace(NON_DIGITS, ''));
          if (codeError) setCodeError('');
        }}
        error={codeError}
        required
        className="text-center font-mono text-lg tracking-[0.4em]"
      />

      <p className="text-muted-foreground text-xs">
        The code works once and expires in {expiryMinutes} minutes. Check your spam folder
        if it does not arrive.
      </p>

      <AuthButton type="submit" className="w-full" actionKey={AUTH_SUBMIT_ACTION}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </AuthButton>
    </form>
  );
}
