import type { SignInMethodIdentity } from '../src/utils/build-sign-in-method-rows';

import { describe, expect, it } from 'vitest';

import { buildSignInMethodRows } from '../src/utils/build-sign-in-method-rows';

function identity(provider: string, email: string | null = null): SignInMethodIdentity {
  return { provider, email };
}

describe('buildSignInMethodRows', () => {
  it('should list what is connected before what could be added', () => {
    const rows = buildSignInMethodRows([identity('email', 'a@b.c')], ['google']);

    expect(rows.map((row) => row.provider)).toEqual(['email', 'google']);
    expect(rows.map((row) => row.isConnected)).toEqual([true, false]);
  });

  it('should not offer a provider that is already connected', () => {
    const rows = buildSignInMethodRows(
      [identity('email'), identity('google', 'a@gmail.com')],
      ['google'],
    );

    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.isConnected)).toBe(true);
  });

  it('should keep the email the provider supplied on connected rows', () => {
    const rows = buildSignInMethodRows([identity('google', 'a@gmail.com')], []);

    expect(rows[0]?.email).toBe('a@gmail.com');
  });

  it('should carry no email on a row that is not connected yet', () => {
    const rows = buildSignInMethodRows([], ['google']);

    expect(rows[0]).toEqual({ provider: 'google', email: null, isConnected: false });
  });

  it('should render read-only when the host offers nothing to link', () => {
    const rows = buildSignInMethodRows([identity('email', 'a@b.c')], []);

    expect(rows).toEqual([{ provider: 'email', email: 'a@b.c', isConnected: true }]);
  });

  it('should preserve the order the host listed its providers in', () => {
    const rows = buildSignInMethodRows([], ['google', 'github', 'linkedin_oidc']);

    expect(rows.map((row) => row.provider)).toEqual([
      'google',
      'github',
      'linkedin_oidc',
    ]);
  });
});
