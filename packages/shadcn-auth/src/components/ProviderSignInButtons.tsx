'use client';

import { OrContinueWithSeparator } from '@pixpilot/shadcn';

import { describeAuthProvider } from '../constants/auth-providers';
import { AuthButton } from './auth-pending/AuthButton';
import { ProviderIcon } from './provider-icon/ProviderIcon';

/** Handlers for the identity providers a host has actually configured. */
export interface ProviderSignInHandlers {
  onGoogleSignIn?: () => Promise<void>;
  onLinkedInSignIn?: () => Promise<void>;
}

export interface ProviderSignInButtonsProps extends ProviderSignInHandlers {
  /** Verb shown on the buttons — "Sign in" on the sign-in step, "Sign up" on sign-up. */
  action?: string;
  /**
   * Whether to draw the "or continue with" rule above the buttons. Pass `false`
   * only when nothing precedes them on the card — a rule directly under the
   * heading separates the buttons from nothing.
   */
  showSeparator?: boolean;
}

/** Supabase provider key, which doubles as the button's action key. */
type ProviderKey = 'google' | 'linkedin_oidc';

interface ProviderEntry {
  provider: ProviderKey;
  onSignIn: () => Promise<void>;
}

/** The providers the host wired, in the order they should appear. */
function collectProviders({
  onGoogleSignIn,
  onLinkedInSignIn,
}: ProviderSignInHandlers): ProviderEntry[] {
  const entries: ProviderEntry[] = [];
  if (onGoogleSignIn != null) {
    entries.push({ provider: 'google', onSignIn: onGoogleSignIn });
  }
  if (onLinkedInSignIn != null) {
    entries.push({ provider: 'linkedin_oidc', onSignIn: onLinkedInSignIn });
  }
  return entries;
}

/**
 * The identity-provider buttons, with the "or continue with" rule above them.
 *
 * The rule lives here rather than at each call site so every auth card spaces
 * its provider buttons the same way; a card whose buttons are the only thing on
 * it opts out with `showSeparator={false}`.
 *
 * A provider only appears when the host passed a handler for it, so an app that
 * has not configured LinkedIn simply does not show a LinkedIn button — no flag
 * to keep in sync with the Supabase dashboard.
 *
 * Loading state comes from the card's pending scope, so clicking Google spins
 * the Google button alone and leaves LinkedIn and the credential form disabled
 * rather than spinning too.
 */
export function ProviderSignInButtons({
  onGoogleSignIn,
  onLinkedInSignIn,
  action = 'Sign in',
  showSeparator = true,
}: ProviderSignInButtonsProps) {
  const providers = collectProviders({ onGoogleSignIn, onLinkedInSignIn });
  if (providers.length === 0) {
    return null;
  }

  return (
    <>
      {showSeparator && <OrContinueWithSeparator />}
      <div className="relative space-y-2">
        {providers.map(({ provider, onSignIn }) => (
          <AuthButton
            key={provider}
            type="button"
            variant="outline"
            className="w-full"
            actionKey={provider}
            onAction={onSignIn}
          >
            <ProviderIcon provider={provider} className="mr-2 h-4 w-4" />
            {`${action} with ${describeAuthProvider(provider)}`}
          </AuthButton>
        ))}
      </div>
    </>
  );
}
