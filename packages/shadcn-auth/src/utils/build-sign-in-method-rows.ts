/** Identity fields the sign-in methods UI needs from any auth provider. */
export interface SignInMethodIdentity {
  provider: string;
  email: string | null;
}

/** One row of the sign-in-methods list, already resolved for rendering. */
export interface SignInMethodRowModel {
  /** Supabase provider key, e.g. `'google'`. */
  provider: string;
  /** Address the provider supplied, when it supplied one. */
  email: string | null;
  /** Whether the provider is attached to the account today. */
  isConnected: boolean;
}

/**
 * Merges what the account already has with what it could add.
 *
 * Connected methods come first, in the order Supabase returned them, so the
 * list reads as "here is what you have" before "here is what you could add".
 * Offering a provider that is already linked is the one thing this must not do
 * — a second link attempt only ever ends in `identity_already_exists`.
 */
export function buildSignInMethodRows(
  identities: readonly SignInMethodIdentity[],
  linkableProviders: readonly string[],
): SignInMethodRowModel[] {
  const linked = new Set(identities.map((identity) => identity.provider));

  return [
    ...identities.map((identity) => ({
      provider: identity.provider,
      email: identity.email,
      isConnected: true,
    })),
    ...linkableProviders
      .filter((provider) => !linked.has(provider))
      .map((provider) => ({ provider, email: null, isConnected: false })),
  ];
}
