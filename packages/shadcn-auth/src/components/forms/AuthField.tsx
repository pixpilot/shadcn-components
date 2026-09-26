'use client';

import type React from 'react';

import { Input, Label } from '@pixpilot/shadcn';

import { useAuthPending } from '../auth-pending';

export interface AuthFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  'disabled'
> {
  id: string;
  label: string;
  /** Validation message for this field, or `''` while it is valid. */
  error?: string;
}

/**
 * A labelled field on an auth card, with its validation message.
 *
 * Takes its disabled state from the card's pending scope, so no form has to
 * remember to lock its inputs while something on the card is in flight.
 */
export function AuthField({
  id,
  label,
  error = '',
  className = '',
  ...inputProps
}: AuthFieldProps) {
  const pending = useAuthPending();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        disabled={pending.isBusy}
        className={`${className} ${error ? 'border-destructive' : ''}`.trim()}
        {...inputProps}
      />
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
