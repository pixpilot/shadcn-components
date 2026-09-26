'use client';

import type React from 'react';

import { useState } from 'react';

import { validateEmailValue } from '../../utils/validate-email';
import { validatePasswordValue } from '../../utils/validate-password';
import { AUTH_SUBMIT_ACTION, AuthButton, useAuthPending } from '../auth-pending';
import { AuthField } from './AuthField';

export interface SignInCredentialsFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
}

/**
 * The email-and-password half of the sign-in card.
 *
 * Its own component so the card is left holding only the choices it offers —
 * providers, the passwordless routes, the step switches — and the credential
 * fields keep their state and validation to themselves.
 */
export function SignInCredentialsForm({ onSignIn }: SignInCredentialsFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const pending = useAuthPending();
  const isSubmitting = pending.pendingKey === AUTH_SUBMIT_ACTION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailMessage = validateEmailValue(email);
    setEmailError(emailMessage ?? '');
    const passwordMessage = validatePasswordValue(password);
    setPasswordError(passwordMessage ?? '');
    if (emailMessage != null || passwordMessage != null) return;

    pending.run(AUTH_SUBMIT_ACTION, async () => onSignIn(email, password));
  };

  return (
    /*
      `noValidate`: the fields keep their `type` and `required` semantics for
      assistive tech and mobile keyboards, but validation is ours. The native
      bubble would otherwise pre-empt the first error and none of the other
      messages on this form have a native equivalent to match.
    */
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

      <AuthButton type="submit" className="mt-6 w-full" actionKey={AUTH_SUBMIT_ACTION}>
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </AuthButton>
    </form>
  );
}
