/**
 * How each Supabase provider key is presented.
 *
 * Keyed by the raw provider string rather than a closed union on purpose: a
 * provider enabled on the Supabase side should render sensibly here without a
 * code change, and {@link describeAuthProvider} falls back to a readable label
 * for anything not listed.
 */
export const AUTH_PROVIDER_LABELS: Record<string, string> = {
  email: 'Email and password',
  phone: 'Phone',
  google: 'Google',
  github: 'GitHub',
  gitlab: 'GitLab',
  linkedin_oidc: 'LinkedIn',
  azure: 'Microsoft',
  apple: 'Apple',
  facebook: 'Facebook',
};

/** Turns `linkedin_oidc` into `Linkedin Oidc` — last resort, not a lookup. */
function humanizeProvider(provider: string): string {
  return provider
    .split(/[_-]/u)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** The label to show for a provider key. */
export function describeAuthProvider(provider: string): string {
  return AUTH_PROVIDER_LABELS[provider] ?? humanizeProvider(provider);
}
