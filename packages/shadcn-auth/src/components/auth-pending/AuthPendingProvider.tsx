'use client';

import type React from 'react';

import type { AuthPendingValue } from './auth-pending-context';

import { AuthPendingContext } from './auth-pending-context';

export interface AuthPendingProviderProps {
  /** The scope, from `useAuthPendingState`. One per auth card. */
  value: AuthPendingValue;
  children: React.ReactNode;
}

/** Shares one auth card's pending scope with every control on it. */
export function AuthPendingProvider({ value, children }: AuthPendingProviderProps) {
  return <AuthPendingContext value={value}>{children}</AuthPendingContext>;
}
