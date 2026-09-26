import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailOtpForm } from '../src/components/EmailOtpForm';

function renderForm(props: Partial<React.ComponentProps<typeof EmailOtpForm>> = {}) {
  const onSendEmailOtp = vi.fn(async () => undefined);
  const onVerifyEmailOtp = vi.fn(async () => undefined);
  render(
    <EmailOtpForm
      onSendEmailOtp={onSendEmailOtp}
      onVerifyEmailOtp={onVerifyEmailOtp}
      isLoading={false}
      error={null}
      {...props}
    />,
  );
  return { onSendEmailOtp, onVerifyEmailOtp };
}

describe('emailOtpForm', () => {
  it('should send a code to the typed address', () => {
    const { onSendEmailOtp } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /email me a sign-in code/iu }));

    expect(onSendEmailOtp).toHaveBeenCalledWith('ada@example.com');
  });

  it('should refuse to send a malformed address', () => {
    const { onSendEmailOtp } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'not-an-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /email me a sign-in code/iu }));

    expect(onSendEmailOtp).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid email address')).toBeDefined();
  });

  it('should switch to code entry once the host reports the code was sent', () => {
    renderForm({ sentTo: 'ada@example.com' });

    expect(screen.getByRole('heading', { name: 'Enter your code' })).toBeDefined();
    expect(screen.getByLabelText('Sign-in code')).toBeDefined();
    expect(screen.queryByLabelText('Email')).toBeNull();
  });

  it('should verify the typed code against the address it was sent to', () => {
    const { onVerifyEmailOtp } = renderForm({ sentTo: 'ada@example.com' });

    fireEvent.change(screen.getByLabelText('Sign-in code'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/iu }));

    expect(onVerifyEmailOtp).toHaveBeenCalledWith('ada@example.com', '123456');
  });

  it('should keep a short code out of the round trip', () => {
    const { onVerifyEmailOtp } = renderForm({ sentTo: 'ada@example.com' });

    fireEvent.change(screen.getByLabelText('Sign-in code'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/iu }));

    expect(onVerifyEmailOtp).not.toHaveBeenCalled();
    expect(screen.getByText('The code is 6 digits')).toBeDefined();
  });

  it('should keep an empty code out of the round trip', () => {
    const { onVerifyEmailOtp } = renderForm({ sentTo: 'ada@example.com' });

    fireEvent.click(screen.getByRole('button', { name: /^sign in$/iu }));

    expect(onVerifyEmailOtp).not.toHaveBeenCalled();
    expect(screen.getByText('Enter the code from your email')).toBeDefined();
  });

  it('should drop non-digits as they are typed', () => {
    renderForm({ sentTo: 'ada@example.com' });

    const input = screen.getByLabelText('Sign-in code');
    fireEvent.change(input, { target: { value: '12a3-4' } });

    expect(input).toHaveValue('1234');
  });

  it('should state the code lifetime the project is configured for', () => {
    renderForm({ sentTo: 'ada@example.com', expiryMinutes: 15 });

    expect(screen.getByText(/expires in 15 minutes/iu)).toBeDefined();
  });

  it('should surface a server error over the code entry state', () => {
    renderForm({
      sentTo: 'ada@example.com',
      error: 'That code has expired or is no longer valid. Request a new one.',
    });

    expect(
      screen.getByText('That code has expired or is no longer valid. Request a new one.'),
    ).toBeDefined();
    expect(screen.getByLabelText('Sign-in code')).toBeDefined();
  });

  it('should disable verification while the host reports work in flight', () => {
    renderForm({ sentTo: 'ada@example.com', isLoading: true });

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  });

  it('should let the user go back and correct a mistyped address', () => {
    const onUseDifferentEmail = vi.fn();
    renderForm({ sentTo: 'ada@exmaple.com', onUseDifferentEmail });

    fireEvent.click(screen.getByRole('button', { name: /use a different email/iu }));

    expect(onUseDifferentEmail).toHaveBeenCalled();
  });

  describe('resend', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should hold the resend back until the cooldown elapses', () => {
      const { onSendEmailOtp } = renderForm({ sentTo: 'ada@example.com' });

      const cooling = screen.getByRole('button', { name: /send a new code in \d+s/iu });
      expect(cooling).toBeDisabled();

      // Each second is its own timeout, scheduled by the effect that runs
      // after the previous tick rendered — so advance one at a time.
      for (let second = 0; second < 60; second += 1) {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
      }

      const ready = screen.getByRole('button', { name: /^send a new code$/iu });
      expect(ready).not.toBeDisabled();

      fireEvent.click(ready);
      expect(onSendEmailOtp).toHaveBeenCalledWith('ada@example.com');
    });

    it('should spin the resend button alone while the resend is in flight', () => {
      renderForm({
        sentTo: 'ada@example.com',
        onSendEmailOtp: vi.fn(async () => new Promise<void>(() => {})),
      });

      for (let second = 0; second < 60; second += 1) {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
      }

      fireEvent.click(screen.getByRole('button', { name: /^send a new code$/iu }));

      const resend = screen.getByRole('button', { name: /send a new code/iu });
      const verify = screen.getByRole('button', { name: 'Sign in' });

      expect(resend.querySelector('[data-slot="button-loader"]')).not.toBeNull();
      expect(verify.querySelector('[data-slot="button-loader"]')).toBeNull();
      expect(verify).toBeDisabled();
    });
  });
});
