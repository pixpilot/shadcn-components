'use client';

import type { SignInMethodIdentity } from '../../utils/build-sign-in-method-rows';

import { Alert, AlertDescription } from '@pixpilot/shadcn';
import { Loader2 } from 'lucide-react';

import { buildSignInMethodRows } from '../../utils/build-sign-in-method-rows';
import { SignInMethodRow } from './SignInMethodRow';

/** Shared empty default, so the prop identity is stable across renders. */
const NO_PROVIDERS: readonly string[] = [];

export interface SignInMethodsListProps {
  /** Methods already attached to the account, password identity included. */
  identities: readonly SignInMethodIdentity[];
  /**
   * Providers this host offers to connect, in display order. A provider that is
   * already linked is filtered out, so passing every configured provider is
   * safe. Empty by default — a host that offers none shows the list read-only.
   */
  linkableProviders?: readonly string[];
  /** True while {@link identities} is still being fetched. */
  isLoading?: boolean;
  /** Provider whose connect flow is in flight, if any. */
  pendingProvider?: string | null;
  /** Failure copy, from the connect action or from the callback's return leg. */
  error?: string | null;
  /** Success copy, shown after a provider has been connected. */
  notice?: string | null;
  /** Starts connecting `provider`. */
  onConnect: (provider: string) => void;
  className?: string;
}

/**
 * The body of the sign-in methods section: the how-to, the outcome messages,
 * and the list itself — everything but the heading.
 *
 * Split out from {@link SignInMethods} so a host can supply its own section
 * heading, alongside {@link SIGN_IN_METHODS_COPY} when it wants this one.
 */
export function SignInMethodsList({
  identities,
  linkableProviders = NO_PROVIDERS,
  isLoading = false,
  pendingProvider = null,
  error = null,
  notice = null,
  onConnect,
  className,
}: SignInMethodsListProps) {
  const rows = buildSignInMethodRows(identities, linkableProviders);
  const hasConnectableProvider = rows.some((row) => !row.isConnected);
  const hasError = error != null && error.trim() !== '';
  const hasNotice = !hasError && notice != null && notice.trim() !== '';

  return (
    <div className={className}>
      {hasConnectableProvider && (
        <div className="text-muted-foreground text-sm">
          <p>To add another sign-in method:</p>
          <ol
            aria-label="How to add a sign-in method"
            className="mt-2 list-decimal space-y-1 pl-5"
          >
            <li>Choose Connect next to the provider you want to add.</li>
            <li>Sign in to that provider and approve the connection.</li>
          </ol>
        </div>
      )}

      {hasError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {hasNotice && (
        <Alert className="mt-4">
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}

      {/*
        Nothing is offered until the list is known: until then we cannot tell a
        provider that is missing from one that is already connected, and
        offering to connect a provider twice only ever ends in an error.
      */}
      {isLoading ? (
        <p className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading sign-in methods...
        </p>
      ) : (
        <ul className="divide-border mt-2 divide-y">
          {rows.map((row) => (
            <SignInMethodRow
              key={row.provider}
              provider={row.provider}
              email={row.email}
              isConnected={row.isConnected}
              isPending={pendingProvider === row.provider}
              isDisabled={pendingProvider != null}
              onConnect={onConnect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

SignInMethodsList.displayName = 'SignInMethodsList';
