'use client';

import type React from 'react';

import { useState } from 'react';

import { AUTH_SUBMIT_ACTION, AuthButton, useAuthPending } from '../auth-pending';
import { AuthField } from './AuthField';

export interface CompleteProfileFieldsProps {
  onSubmit: (name: string) => Promise<void>;
  /** The host's server-enforced display name limit. */
  maxDisplayNameLength: number;
  /** Prefill, when some provider supplied a partial name. */
  defaultName?: string | null;
}

/** The name field of the complete-profile card. */
export function CompleteProfileFields({
  onSubmit,
  maxDisplayNameLength,
  defaultName,
}: CompleteProfileFieldsProps) {
  const [name, setName] = useState(defaultName ?? '');
  const [nameError, setNameError] = useState('');
  const pending = useAuthPending();
  const isSubmitting = pending.pendingKey === AUTH_SUBMIT_ACTION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setNameError('Please enter your name');
      return;
    }
    if (trimmed.length > maxDisplayNameLength) {
      setNameError(`Your name must be ${maxDisplayNameLength} characters or fewer`);
      return;
    }
    setNameError('');

    pending.run(AUTH_SUBMIT_ACTION, async () => onSubmit(trimmed));
  };

  return (
    /* See the `noValidate` note on the sign-in credentials form. */
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthField
        id="full_name"
        label="Full name"
        name="full_name"
        type="text"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError('');
        }}
        error={nameError}
        maxLength={maxDisplayNameLength}
        required
      />

      <AuthButton type="submit" className="mt-6 w-full" actionKey={AUTH_SUBMIT_ACTION}>
        {isSubmitting ? 'Saving...' : 'Continue'}
      </AuthButton>
    </form>
  );
}
