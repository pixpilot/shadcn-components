import React, { useState } from 'react';

import { ResetPasswordForm } from './ResetPasswordForm';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthFormsProps {
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignUp: (email: string, password: string) => Promise<void>;
  handleResetPassword: (email: string) => Promise<void>;
  authLoadingState: { isLoading: boolean };
  authErrorData?: { error: string } | null;
}

export function AuthForms({
  handleSignIn,
  handleSignUp,
  handleResetPassword,
  authLoadingState,
  authErrorData,
}: AuthFormsProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Job Hunter</h1>
        {authMode === 'signin' && (
          <SignInForm
            onSignIn={handleSignIn}
            isLoading={authLoadingState.isLoading}
            error={authErrorData?.error ?? null}
            onSwitchToSignUp={() => setAuthMode('signup')}
            onSwitchToReset={() => setAuthMode('reset')}
          />
        )}
        {authMode === 'signup' && (
          <SignUpForm
            onSignUp={handleSignUp}
            isLoading={authLoadingState.isLoading}
            error={authErrorData?.error ?? null}
            onSwitchToSignIn={() => setAuthMode('signin')}
          />
        )}
        {authMode === 'reset' && (
          <ResetPasswordForm
            onResetPassword={handleResetPassword}
            isLoading={authLoadingState.isLoading}
            error={authErrorData?.error ?? null}
            onSwitchToSignIn={() => setAuthMode('signin')}
          />
        )}
      </div>
    </div>
  );
}
