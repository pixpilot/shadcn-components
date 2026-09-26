'use client';

import type React from 'react';

import { useState } from 'react';

import { validateEmailValue } from '../../utils/validate-email';
import { AUTH_SUBMIT_ACTION, AuthButton, useAuthPending } from '../auth-pending';
import { LegalNotice } from '../LegalNotice';
import { AuthField } from './AuthField';

export interface EmailRequestFormProps {
  /** Distinguishes this form's field from another card's. */
  fieldId: string;
  onSubmitEmail: (email: string) => Promise<void>;
  /** Button copy at rest, and while its send is in flight. */
  submitLabel: string;
  submittingLabel: string;
  /**
   * Terms line shown above the button. Passed only by the passwordless routes,
   * which double as sign-up and so need the acceptance that the password
   * sign-up form collects with a checkbox.
   */
  termsUrl?: string;
  privacyPolicyUrl?: string;
  privacyNotice?: React.ReactNode;
}

/**
 * A card body that collects one address and sends something to it.
 *
 * The magic-link and emailed-code routes ask for exactly the same thing and
 * differ only in what lands in the inbox, so they share this rather than
 * keeping two copies of the same field, validation and Terms line.
 */
export function EmailRequestForm({
  fieldId,
  onSubmitEmail,
  submitLabel,
  submittingLabel,
  termsUrl,
  privacyPolicyUrl,
  privacyNotice,
}: EmailRequestFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const pending = useAuthPending();
  const isSubmitting = pending.pendingKey === AUTH_SUBMIT_ACTION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailMessage = validateEmailValue(email);
    setEmailError(emailMessage ?? '');
    if (emailMessage != null) return;

    pending.run(AUTH_SUBMIT_ACTION, async () => onSubmitEmail(email));
  };

  return (
    /* See the `noValidate` note on the sign-in credentials form. */
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthField
        id={fieldId}
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

      {termsUrl != null && (
        <p className="text-muted-foreground text-xs">
          By continuing you accept the{' '}
          <a
            href={termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Terms of Service
          </a>
          . If you don't have an account yet, one will be created for you.
        </p>
      )}
      {(privacyNotice != null || privacyPolicyUrl != null) && (
        <LegalNotice privacyPolicyUrl={privacyPolicyUrl} notice={privacyNotice} />
      )}

      <AuthButton type="submit" className="mt-6 w-full" actionKey={AUTH_SUBMIT_ACTION}>
        {isSubmitting ? submittingLabel : submitLabel}
      </AuthButton>
    </form>
  );
}
