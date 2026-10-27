import type React from 'react';
import { cn } from '@pixpilot/shadcn';

const BUTTON_CLASSES =
  'focus-visible:ring-ring inline-flex h-12 w-[200px] items-center justify-center rounded-md px-8 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none';

export interface SignedOutScreenProps {
  /** Defaults to "You've been securely logged out". */
  title?: React.ReactNode;
  /** Defaults to a line saying the session is closed and the window can be closed. */
  description?: React.ReactNode;
  /** Defaults to `/login`. */
  signInHref?: string;
  /** Defaults to "Log back in". */
  signInLabel?: React.ReactNode;
  /** Defaults to `/`. */
  homeHref?: string;
  /** Defaults to "Back to homepage". */
  homeLabel?: React.ReactNode;
  /** Where "Let us know" links; `null` hides the line. Defaults to `/contact`. */
  contactHref?: string | null;
  className?: string;
}

/**
 * Where signing out lands. Its links are plain anchors on purpose: a full page
 * load leaves no signed-in state behind in the client.
 */
export function SignedOutScreen({
  title = "You've been securely logged out",
  description = 'Your session is closed and your account is safe. If you were using a shared or public computer, you can close this window now.',
  signInHref = '/login',
  signInLabel = 'Log back in',
  homeHref = '/',
  homeLabel = 'Back to homepage',
  contactHref = '/contact',
  className,
}: SignedOutScreenProps) {
  return (
    <main
      className={cn(
        'flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
        className,
      )}
    >
      <div className="mx-auto max-w-xl text-center">
        <div className="bg-primary/10 text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-foreground mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-md text-lg">
          {description}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={signInHref}
            className={cn(
              BUTTON_CLASSES,
              'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {signInLabel}
          </a>
          <a
            href={homeHref}
            className={cn(
              BUTTON_CLASSES,
              'border-border bg-background hover:bg-accent border',
            )}
          >
            {homeLabel}
          </a>
        </div>

        {contactHref !== null && (
          <p className="text-muted-foreground mt-10 text-sm">
            Something not working as expected?{' '}
            <a href={contactHref} className="text-primary hover:underline">
              Let us know
            </a>
            .
          </p>
        )}
      </div>
    </main>
  );
}

SignedOutScreen.displayName = 'SignedOutScreen';
