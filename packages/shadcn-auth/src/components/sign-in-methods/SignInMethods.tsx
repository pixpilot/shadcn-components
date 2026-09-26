'use client';

import type { SignInMethodsListProps } from './SignInMethodsList';

import { SIGN_IN_METHODS_COPY } from './sign-in-methods-copy';
import { SignInMethodsList } from './SignInMethodsList';

export interface SignInMethodsProps extends SignInMethodsListProps {}

/**
 * The account's sign-in methods: what is connected, and what can be added.
 *
 * Presentational by design — the host owns fetching, the connect action, and
 * the error/success copy, exactly as the login screen owns them for
 * `AuthForms`. Adding GitHub or LinkedIn later is one more entry in
 * `linkableProviders`; nothing in here is provider-specific.
 *
 * This is the composed default, heading included, for a host with no section
 * card of its own. A host that has one renders {@link SignInMethodsList} under
 * its own heading and takes the wording from {@link SIGN_IN_METHODS_COPY}.
 */
export function SignInMethods({ className, ...props }: SignInMethodsProps) {
  return (
    <div className={className}>
      <h3 className="font-medium">{SIGN_IN_METHODS_COPY.title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        {SIGN_IN_METHODS_COPY.description}
      </p>
      <SignInMethodsList {...props} className="mt-4" />
    </div>
  );
}

SignInMethods.displayName = 'SignInMethods';
