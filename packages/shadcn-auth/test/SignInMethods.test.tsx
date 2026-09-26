import type { SignInMethodIdentity } from '../src/utils/build-sign-in-method-rows';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SignInMethods } from '../src/components/sign-in-methods/SignInMethods';

function identity(provider: string, email: string | null = null): SignInMethodIdentity {
  return { provider, email };
}

function baseProps() {
  return {
    identities: [identity('email', 'user@work.test')],
    linkableProviders: ['google'],
    onConnect: vi.fn(),
  };
}

describe('signInMethods', () => {
  it('should show the password identity as a connected method', () => {
    render(<SignInMethods {...baseProps()} />);

    expect(screen.getByText('Email and password')).toBeDefined();
    expect(screen.getByText('user@work.test')).toBeDefined();
    expect(screen.getByText('Connected')).toBeDefined();
  });

  it('should offer a provider that is not connected yet', () => {
    render(<SignInMethods {...baseProps()} />);

    expect(screen.getByRole('button', { name: 'Connect Google' })).toBeDefined();
  });

  it('should explain how to add an available sign-in method', () => {
    render(<SignInMethods {...baseProps()} />);

    const instructions = screen.getByRole('list', {
      name: 'How to add a sign-in method',
    });
    expect(instructions).toHaveTextContent(
      'Choose Connect next to the provider you want to add.',
    );
    expect(instructions).toHaveTextContent(
      'Sign in to that provider and approve the connection.',
    );
  });

  it('should report which provider the user asked to connect', () => {
    const props = baseProps();
    render(<SignInMethods {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Connect Google' }));

    expect(props.onConnect).toHaveBeenCalledWith('google');
  });

  it('should show a connected provider instead of offering it again', () => {
    render(
      <SignInMethods
        {...baseProps()}
        identities={[
          identity('email', 'user@work.test'),
          identity('google', 'me@gmail.com'),
        ]}
      />,
    );

    expect(screen.queryByRole('button', { name: /connect/iu })).toBeNull();
    expect(screen.getByText('me@gmail.com')).toBeDefined();
  });

  it('should label an unknown provider rather than rendering a blank row', () => {
    render(
      <SignInMethods
        {...baseProps()}
        identities={[identity('linkedin_oidc', 'me@work.test')]}
      />,
    );

    expect(screen.getByText('LinkedIn')).toBeDefined();
  });

  it('should hold the button while the connect flow is in flight', () => {
    render(<SignInMethods {...baseProps()} pendingProvider="google" />);

    const button = screen.getByRole('button', { name: /connecting/iu });
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('should not let a second provider be started mid-flow', () => {
    render(
      <SignInMethods
        {...baseProps()}
        linkableProviders={['google', 'github']}
        pendingProvider="google"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Connect GitHub' }).hasAttribute('disabled'),
    ).toBe(true);
  });

  it('should show the failure copy the host supplied', () => {
    render(<SignInMethods {...baseProps()} error="That account is already linked." />);

    expect(screen.getByText('That account is already linked.')).toBeDefined();
  });

  it('should show a success notice after a provider is connected', () => {
    render(<SignInMethods {...baseProps()} notice="Google is now connected." />);

    expect(screen.getByText('Google is now connected.')).toBeDefined();
  });

  it('should not show a stale success notice alongside a failure', () => {
    render(
      <SignInMethods {...baseProps()} error="Could not connect." notice="Connected." />,
    );

    expect(screen.queryByText('Connected.')).toBeNull();
  });

  it('should say it is still loading before any method is known', () => {
    render(<SignInMethods {...baseProps()} identities={[]} isLoading />);

    expect(screen.getByText(/loading sign-in methods/iu)).toBeDefined();
    expect(screen.queryByRole('button', { name: /connect/iu })).toBeNull();
  });

  it('should render a read-only list when the host offers nothing to link', () => {
    render(<SignInMethods {...baseProps()} linkableProviders={[]} />);

    expect(screen.getByText('Email and password')).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
    expect(
      screen.queryByRole('list', { name: 'How to add a sign-in method' }),
    ).toBeNull();
  });
});
