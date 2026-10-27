import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SignInScreen } from '../src/components/SignInScreen';

describe('signInScreen', () => {
  it('should show the default copy', () => {
    render(<SignInScreen onSignIn={async () => undefined} />);

    expect(screen.getByRole('heading', { name: 'Authentication Required' })).toBeTruthy();
    expect(screen.getByText('Please sign in to access extension features.')).toBeTruthy();
    expect(
      screen.getByText("You'll be redirected to our secure login page"),
    ).toBeTruthy();
  });

  it('should call onSignIn when the button is clicked', () => {
    const onSignIn = vi.fn(async () => undefined);
    render(<SignInScreen onSignIn={onSignIn} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign In to Continue' }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('should show an error when the sign-in page cannot be opened', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(<SignInScreen onSignIn={async () => Promise.reject(new Error('nope'))} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign In to Continue' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'The sign-in page could not be opened. Please try again.',
    );
  });

  it('should use the given copy', () => {
    render(
      <SignInScreen
        onSignIn={async () => undefined}
        title="Sign in to Acme"
        signInLabel="Sign in"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Sign in to Acme' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
  });
});
