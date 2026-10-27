import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SignedOutScreen } from '../src/components/SignedOutScreen';

describe('signedOutScreen', () => {
  it('should link back to sign-in, home and contact by default', () => {
    render(<SignedOutScreen />);

    expect(
      screen.getByRole('heading', { name: "You've been securely logged out" }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Log back in' }).getAttribute('href')).toBe(
      '/login',
    );
    expect(
      screen.getByRole('link', { name: 'Back to homepage' }).getAttribute('href'),
    ).toBe('/');
    expect(screen.getByRole('link', { name: 'Let us know' }).getAttribute('href')).toBe(
      '/contact',
    );
  });

  it('should hide the contact line when contactHref is null', () => {
    render(<SignedOutScreen contactHref={null} signInHref="/sign-in" />);

    expect(screen.queryByRole('link', { name: 'Let us know' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Log back in' }).getAttribute('href')).toBe(
      '/sign-in',
    );
  });
});
