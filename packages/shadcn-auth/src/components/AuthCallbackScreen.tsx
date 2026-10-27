import type React from 'react';
import type { AuthCallbackStatus } from '../hooks/use-auth-callback';
import { cn } from '@pixpilot/shadcn';
import { CircleLoader } from '@pixpilot/shadcn-ui';

export interface AuthCallbackScreenProps {
  /** Usually from `useAuthCallback`. */
  status: AuthCallbackStatus;
  /** Defaults to "Signing you in…". */
  loadingText?: React.ReactNode;
  /** Defaults to "You are signed in. This tab closes by itself.". */
  successText?: React.ReactNode;
  className?: string;
}

/** The page a sign-in redirects back to, showing a `useAuthCallback` status. */
export function AuthCallbackScreen({
  status,
  loadingText = 'Signing you in…',
  successText = 'You are signed in. This tab closes by itself.',
  className,
}: AuthCallbackScreenProps) {
  return (
    <main
      className={cn(
        'flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center',
        className,
      )}
    >
      {status.kind === 'loading' && (
        <>
          <CircleLoader size={64} />
          <p>{loadingText}</p>
        </>
      )}
      {status.kind === 'success' && (
        <p role="status" className="text-lg font-medium text-emerald-600">
          {successText}
        </p>
      )}
      {status.kind === 'error' && (
        <p role="alert" className="text-destructive text-lg font-medium">
          {status.message}
        </p>
      )}
    </main>
  );
}

AuthCallbackScreen.displayName = 'AuthCallbackScreen';
