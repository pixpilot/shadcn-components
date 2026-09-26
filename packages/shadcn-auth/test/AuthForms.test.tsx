import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthForms } from '../src/components/AuthForms';

function baseProps() {
  return {
    onSignIn: vi.fn(async () => undefined),
    onSignUp: vi.fn(async () => undefined),
    isLoading: false,
    error: null,
  };
}

describe('authForms', () => {
  it('should open on the sign-in step', () => {
    render(<AuthForms {...baseProps()} />);

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeDefined();
  });

  it('should hide the passwordless step when no handler is wired', () => {
    render(<AuthForms {...baseProps()} />);

    expect(
      screen.queryByRole('button', { name: /email me a sign-in link/iu }),
    ).toBeNull();
  });

  it('should hide the reset step when no handler is wired', () => {
    render(<AuthForms {...baseProps()} />);

    expect(screen.queryByRole('button', { name: /forgot your password/iu })).toBeNull();
  });

  it('should hide credentials, signup, and recovery when their handlers are omitted', () => {
    render(
      <AuthForms
        isLoading={false}
        error={null}
        onGoogleSignIn={vi.fn(async () => undefined)}
        onSendMagicLink={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.queryByLabelText('Email')).toBeNull();
    expect(screen.queryByLabelText('Password')).toBeNull();
    expect(screen.queryByRole('button', { name: /^sign up$/iu })).toBeNull();
    expect(screen.queryByRole('button', { name: /forgot your password/iu })).toBeNull();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeDefined();
    expect(
      screen.getByRole('button', { name: /email me a sign-in link instead/iu }),
    ).toBeDefined();
  });

  it('should switch to the passwordless step and back', () => {
    render(<AuthForms {...baseProps()} onSendMagicLink={vi.fn(async () => undefined)} />);

    fireEvent.click(
      screen.getByRole('button', { name: /email me a sign-in link instead/iu }),
    );
    expect(screen.getByRole('heading', { name: 'Sign in with email' })).toBeDefined();

    fireEvent.click(
      screen.getByRole('button', { name: /sign in with a password instead/iu }),
    );
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeDefined();
  });

  it('should report every step change so the host can clear its own state', () => {
    const onModeChange = vi.fn();
    render(
      <AuthForms
        {...baseProps()}
        onSendMagicLink={vi.fn(async () => undefined)}
        onModeChange={onModeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /sign up/iu }));
    expect(onModeChange).toHaveBeenLastCalledWith('signup');

    fireEvent.click(
      screen.getByRole('button', { name: /email me a sign-in link instead/iu }),
    );
    expect(onModeChange).toHaveBeenLastCalledWith('magic-link');
  });

  it('should report the passwordless step again when correcting the address', () => {
    const onModeChange = vi.fn();
    render(
      <AuthForms
        {...baseProps()}
        initialMode="magic-link"
        magicLinkSentTo="ada@exmaple.com"
        onSendMagicLink={vi.fn(async () => undefined)}
        onModeChange={onModeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /use a different email/iu }));

    expect(onModeChange).toHaveBeenLastCalledWith('magic-link');
  });

  it('should offer both providers on every step that can start a sign-in', () => {
    render(
      <AuthForms
        {...baseProps()}
        onGoogleSignIn={vi.fn(async () => undefined)}
        onLinkedInSignIn={vi.fn(async () => undefined)}
        onSendMagicLink={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Sign in with LinkedIn' })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /sign up$/iu }));
    expect(screen.getByRole('button', { name: 'Sign up with Google' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Sign up with LinkedIn' })).toBeDefined();
  });

  it('should render the product title above the card', () => {
    render(<AuthForms {...baseProps()} title="Job Hunter" />);

    expect(screen.getByRole('heading', { name: 'Job Hunter', level: 1 })).toBeDefined();
  });

  it('should render caller-provided footer content below the form', () => {
    render(<AuthForms {...baseProps()} footer={<a href="/privacy">Privacy Policy</a>} />);

    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toBeDefined();
  });

  it('should show the privacy notice passed by the host on sign-up', () => {
    render(
      <AuthForms
        {...baseProps()}
        initialMode="signup"
        privacyNotice={
          <>
            Example privacy notice. <a href="/custom-privacy">Read our policy</a>
          </>
        }
      />,
    );

    expect(screen.getByText('Example privacy notice.')).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Read our policy' }).getAttribute('href'),
    ).toBe('/custom-privacy');
    expect(screen.queryByText(/we do not send marketing email/iu)).toBeNull();
  });

  it('should start on a caller-chosen step', () => {
    render(
      <AuthForms
        {...baseProps()}
        initialMode="magic-link"
        onSendMagicLink={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Sign in with email' })).toBeDefined();
  });

  /*
   * The disclosure exists so a passwordless product can still let one known
   * account in without putting password fields in front of every visitor, so
   * what matters is that the fields are genuinely absent until asked for.
   */
  describe('credentials disclosure', () => {
    const LABEL = 'Have an invitation? Sign in here';

    it('should show the credential fields straight away when no label is given', () => {
      render(<AuthForms {...baseProps()} />);

      expect(screen.getByLabelText('Email')).toBeDefined();
      expect(screen.getByLabelText('Password')).toBeDefined();
    });

    it('should hide the credential fields behind the label', () => {
      render(<AuthForms {...baseProps()} credentialsDisclosureLabel={LABEL} />);

      expect(screen.queryByLabelText('Email')).toBeNull();
      expect(screen.queryByLabelText('Password')).toBeNull();
      expect(screen.getByRole('button', { name: LABEL })).toBeDefined();
    });

    it('should reveal the credential fields once the label is clicked', () => {
      render(<AuthForms {...baseProps()} credentialsDisclosureLabel={LABEL} />);

      fireEvent.click(screen.getByRole('button', { name: LABEL }));

      expect(screen.getByLabelText('Email')).toBeDefined();
      expect(screen.getByLabelText('Password')).toBeDefined();
      // The invitation has been taken up; leaving it on screen would only
      // offer to do again what has already happened.
      expect(screen.queryByRole('button', { name: LABEL })).toBeNull();
    });

    it('should not offer the disclosure when credentials are not wired at all', () => {
      render(
        <AuthForms
          isLoading={false}
          error={null}
          credentialsDisclosureLabel={LABEL}
          onGoogleSignIn={vi.fn(async () => undefined)}
        />,
      );

      expect(screen.queryByRole('button', { name: LABEL })).toBeNull();
      expect(screen.queryByLabelText('Password')).toBeNull();
    });
  });
});
