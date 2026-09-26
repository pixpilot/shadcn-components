import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SignInForm } from '../src/components/SignInForm';

function renderForm(props: Partial<React.ComponentProps<typeof SignInForm>> = {}) {
  const onSignIn = vi.fn(async () => undefined);
  render(<SignInForm onSignIn={onSignIn} isLoading={false} error={null} {...props} />);
  return { onSignIn };
}

describe('signInForm', () => {
  it('should submit the credentials as typed', () => {
    const { onSignIn } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'hunter22' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(onSignIn).toHaveBeenCalledWith('ada@example.com', 'hunter22');
  });

  it('should refuse a malformed email before submitting', () => {
    const { onSignIn } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nope' } });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'hunter22' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(onSignIn).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid email address')).toBeDefined();
  });

  it('should refuse a password below the minimum length', () => {
    const { onSignIn } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(onSignIn).not.toHaveBeenCalled();
    expect(screen.getByText(/at least 6 characters/iu)).toBeDefined();
  });

  it('should start a provider sign-in when its button is clicked', async () => {
    const onGoogleSignIn = vi.fn(async () => undefined);
    const onLinkedInSignIn = vi.fn(async () => undefined);
    renderForm({ onGoogleSignIn, onLinkedInSignIn });

    fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));
    expect(onGoogleSignIn).toHaveBeenCalled();

    // The LinkedIn button is held disabled until Google's attempt settles.
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Sign in with LinkedIn' }),
      ).not.toHaveProperty('disabled', true);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign in with LinkedIn' }));
    expect(onLinkedInSignIn).toHaveBeenCalled();
  });

  it('should spin only the provider button that was pressed', () => {
    renderForm({
      onGoogleSignIn: vi.fn(async () => new Promise<void>(() => {})),
      onLinkedInSignIn: vi.fn(async () => new Promise<void>(() => {})),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));

    const google = screen.getByRole('button', { name: 'Sign in with Google' });
    const linkedIn = screen.getByRole('button', { name: 'Sign in with LinkedIn' });

    expect(google.querySelector('[data-slot="button-loader"]')).not.toBeNull();
    expect(linkedIn.querySelector('[data-slot="button-loader"]')).toBeNull();
    expect(linkedIn).toHaveProperty('disabled', true);
  });

  it('should disable but not spin the provider buttons while the form submits', () => {
    renderForm({
      isLoading: true,
      onGoogleSignIn: vi.fn(async () => undefined),
    });

    const google = screen.getByRole('button', { name: 'Sign in with Google' });

    expect(google).toHaveProperty('disabled', true);
    expect(google.querySelector('[data-slot="button-loader"]')).toBeNull();
  });

  it('should render the Google mark in its brand colours', () => {
    renderForm({ onGoogleSignIn: vi.fn(async () => undefined) });

    const googlePaths = screen
      .getByRole('button', { name: 'Sign in with Google' })
      .querySelectorAll('svg path');

    expect(Array.from(googlePaths, (path) => path.getAttribute('fill'))).toEqual([
      '#4285F4',
      '#34A853',
      '#FBBC05',
      '#EA4335',
    ]);
  });

  it('should render the magic-link switch as a full-width mail button', () => {
    renderForm({ onSwitchToMagicLink: vi.fn() });

    const magicLinkButton = screen.getByRole('button', {
      name: 'Email me a sign-in link instead',
    });
    expect(magicLinkButton).toHaveClass('w-full');
    expect(magicLinkButton.querySelector('svg')).not.toBeNull();
  });

  it('should render the server error', () => {
    renderForm({ error: 'Invalid email or password. Please try again.' });

    expect(
      screen.getByText('Invalid email or password. Please try again.'),
    ).toBeDefined();
  });

  it('should ignore a blank error string', () => {
    renderForm({ error: '   ' });

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('should disable the form while the host reports work in flight', () => {
    renderForm({ isLoading: true });

    // The host's flag cannot say which button started the work, so it disables
    // the card without claiming any particular button is the one running.
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('should report progress on the submit button that started the sign-in', () => {
    renderForm({ onSignIn: vi.fn(async () => new Promise<void>(() => {})) });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'hunter22' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByRole('button', { name: /signing in/iu })).toBeDisabled();
  });
});
