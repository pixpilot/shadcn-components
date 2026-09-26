import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MagicLinkForm } from '../src/components/MagicLinkForm';

function renderForm(props: Partial<React.ComponentProps<typeof MagicLinkForm>> = {}) {
  const onSendMagicLink = vi.fn(async () => undefined);
  render(
    <MagicLinkForm
      onSendMagicLink={onSendMagicLink}
      isLoading={false}
      error={null}
      {...props}
    />,
  );
  return { onSendMagicLink };
}

describe('magicLinkForm', () => {
  it('should send the typed address when the form is submitted', () => {
    const { onSendMagicLink } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /email me a sign-in link/iu }));

    expect(onSendMagicLink).toHaveBeenCalledWith('ada@example.com');
  });

  it('should refuse to send a malformed address', () => {
    const { onSendMagicLink } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'not-an-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /email me a sign-in link/iu }));

    expect(onSendMagicLink).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid email address')).toBeDefined();
  });

  it('should refuse to send an empty address', () => {
    const { onSendMagicLink } = renderForm();

    fireEvent.click(screen.getByRole('button', { name: /email me a sign-in link/iu }));

    expect(onSendMagicLink).not.toHaveBeenCalled();
    expect(screen.getByText('Email is required')).toBeDefined();
  });

  it('should show the receipt once the host reports the link was sent', () => {
    renderForm({ sentTo: 'ada@example.com' });

    expect(screen.getByText('Check your email')).toBeDefined();
    expect(screen.getByText('ada@example.com')).toBeDefined();
    expect(screen.queryByLabelText('Email')).toBeNull();
  });

  it('should surface a server error over the input state', () => {
    renderForm({ error: 'Too many emails sent. Please wait a moment and try again.' });

    expect(
      screen.getByText('Too many emails sent. Please wait a moment and try again.'),
    ).toBeDefined();
    expect(screen.getByLabelText('Email')).toBeDefined();
  });

  it('should disable submission while the host reports work in flight', () => {
    renderForm({ isLoading: true });

    expect(
      screen.getByRole('button', { name: 'Email me a sign-in link' }),
    ).toBeDisabled();
  });

  it('should offer provider buttons only for the providers the host wired', () => {
    const { rerender } = render(
      <MagicLinkForm
        onSendMagicLink={vi.fn(async () => undefined)}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole('button', { name: /google/iu })).toBeNull();
    expect(screen.queryByRole('button', { name: /linkedin/iu })).toBeNull();

    rerender(
      <MagicLinkForm
        onSendMagicLink={vi.fn(async () => undefined)}
        onGoogleSignIn={vi.fn(async () => undefined)}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.getByRole('button', { name: /google/iu })).toBeDefined();
    expect(screen.queryByRole('button', { name: /linkedin/iu })).toBeNull();
  });

  it('should let the user go back and correct a mistyped address', () => {
    const onUseDifferentEmail = vi.fn();
    renderForm({ sentTo: 'ada@exmaple.com', onUseDifferentEmail });

    fireEvent.click(screen.getByRole('button', { name: /use a different email/iu }));

    expect(onUseDifferentEmail).toHaveBeenCalled();
  });
});
