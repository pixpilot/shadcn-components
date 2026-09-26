'use client';

import type React from 'react';

import { Label } from '@pixpilot/shadcn';
import { useState } from 'react';

import { DEFAULT_MINIMUM_AGE } from '../../constants/validation';
import { validateEmailValue } from '../../utils/validate-email';
import { validatePasswordValue } from '../../utils/validate-password';
import { AUTH_SUBMIT_ACTION, AuthButton, useAuthPending } from '../auth-pending';
import { LegalNotice } from '../LegalNotice';
import { AuthField } from './AuthField';

export interface SignUpCredentialsFormProps {
  onSignUp: (email: string, password: string) => Promise<void>;
  privacyPolicyUrl: string;
  privacyNotice?: React.ReactNode;
  termsUrl: string;
  /** Minimum age stated by the Terms; shown in the acceptance line. */
  minimumAge?: number;
  onConsentGiven?: () => void;
}

/** The account-details half of the sign-up card: credentials and the consent it needs. */
export function SignUpCredentialsForm({
  onSignUp,
  privacyPolicyUrl,
  privacyNotice,
  termsUrl,
  minimumAge = DEFAULT_MINIMUM_AGE,
  onConsentGiven,
}: SignUpCredentialsFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');
  const pending = useAuthPending();
  const isSubmitting = pending.pendingKey === AUTH_SUBMIT_ACTION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailMessage = validateEmailValue(email);
    setEmailError(emailMessage ?? '');
    const passwordMessage = validatePasswordValue(password);
    setPasswordError(passwordMessage ?? '');
    if (emailMessage != null || passwordMessage != null) return;

    if (!consentChecked) {
      setConsentError('You must accept the Terms of Service to create an account.');
      return;
    }
    setConsentError('');

    onConsentGiven?.();
    pending.run(AUTH_SUBMIT_ACTION, async () => onSignUp(email, password));
  };

  return (
    /* See the `noValidate` note on the sign-in credentials form. */
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError('');
        }}
        error={emailError}
        required
      />

      <AuthField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError('');
        }}
        error={passwordError}
        required
      />

      {/*
        One checkbox, and it covers only the contract: accepting the Terms
        and confirming eligibility. The Privacy Policy is referenced below
        it as a notice rather than folded into the same tick, because the
        processing needed to run the service is performed to deliver the
        contract — asking for "consent" to it would misstate the legal basis
        and imply a choice the user does not actually have.
      */}
      <div className="mt-4 flex items-start gap-2">
        <input
          type="checkbox"
          id="consent"
          checked={consentChecked}
          onChange={(e) => {
            setConsentChecked(e.target.checked);
            if (e.target.checked) setConsentError('');
          }}
          disabled={pending.isBusy}
          aria-describedby="consent-privacy-note"
          aria-invalid={consentError !== ''}
          className="border-input text-primary focus-visible:ring-ring mt-1 h-4 w-4 shrink-0 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
        <Label htmlFor="consent" className="block min-w-0 flex-1 text-sm leading-relaxed">
          I accept the{' '}
          <a
            href={termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Terms of Service
          </a>{' '}
          and confirm I am at least {minimumAge} years old.
        </Label>
      </div>
      {consentError && (
        <p className="text-destructive text-sm" role="alert">
          {consentError}
        </p>
      )}
      <LegalNotice
        id="consent-privacy-note"
        privacyPolicyUrl={privacyPolicyUrl}
        notice={privacyNotice}
      />

      <AuthButton
        type="submit"
        className="mt-6 w-full"
        actionKey={AUTH_SUBMIT_ACTION}
        disabled={!consentChecked}
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </AuthButton>
    </form>
  );
}
