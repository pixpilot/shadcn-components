'use client';

import type React from 'react';
import { cn } from '@pixpilot/shadcn';
import { Button } from '@pixpilot/shadcn-ui';
import { useState } from 'react';

export interface SignInScreenProps {
  /** Opens the sign-in page. A rejection shows `errorMessage` under the button. */
  onSignIn: () => Promise<void>;
  /** Defaults to "Authentication Required". */
  title?: React.ReactNode;
  /** Defaults to "Please sign in to access extension features.". */
  description?: React.ReactNode;
  /** Defaults to "Sign In to Continue". */
  signInLabel?: React.ReactNode;
  /** Defaults to "You'll be redirected to our secure login page". */
  note?: React.ReactNode;
  /** Defaults to "The sign-in page could not be opened. Please try again.". */
  errorMessage?: React.ReactNode;
  className?: string;
}

/**
 * Shown in place of a page until the user signs in, such as in a browser
 * extension whose sign-in happens on the website.
 */
export function SignInScreen({
  onSignIn,
  title = 'Authentication Required',
  description = 'Please sign in to access extension features.',
  signInLabel = 'Sign In to Continue',
  note = "You'll be redirected to our secure login page",
  errorMessage = 'The sign-in page could not be opened. Please try again.',
  className,
}: SignInScreenProps) {
  const [failed, setFailed] = useState(false);

  const handleSignIn = () => {
    setFailed(false);
    onSignIn().catch((reason: unknown) => {
      console.error('[shadcn-auth] Could not open the sign-in page.', reason);
      setFailed(true);
    });
  };

  return (
    <main
      className={cn(
        'relative flex min-h-screen flex-col items-center overflow-hidden px-4 pt-40',
        className,
      )}
    >
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-foreground h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-foreground/80 text-2xl font-semibold">{title}</h2>
          <p className="text-foreground/60 text-center text-sm">{description}</p>
        </div>
        <Button
          onClick={handleSignIn}
          className="w-full rounded-lg px-6 py-3 font-medium shadow-lg transition-all duration-100 hover:scale-101 hover:shadow-xl"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            {signInLabel}
          </span>
        </Button>
        <p className="text-foreground/50 text-center text-xs">{note}</p>
        {failed && (
          <p role="alert" className="text-destructive text-center text-sm">
            {errorMessage}
          </p>
        )}
      </div>
    </main>
  );
}

SignInScreen.displayName = 'SignInScreen';
