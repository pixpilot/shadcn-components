import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ResetPasswordForm } from '../src/components/ResetPasswordForm';

function renderForm(props: Partial<React.ComponentProps<typeof ResetPasswordForm>> = {}) {
  const onResetPassword = vi.fn(async () => undefined);
  render(
    <ResetPasswordForm
      onResetPassword={onResetPassword}
      isLoading={false}
      error={null}
      {...props}
    />,
  );
  return { onResetPassword };
}

describe('resetPasswordForm', () => {
  it('should request recovery for the typed email address', () => {
    const { onResetPassword } = renderForm();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset email/iu }));

    expect(onResetPassword).toHaveBeenCalledWith('ada@example.com');
  });

  it('should show the recovery receipt supplied by the host', () => {
    renderForm({ sentTo: 'ada@example.com' });

    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeDefined();
    expect(screen.getByText('ada@example.com')).toBeDefined();
    expect(screen.queryByLabelText('Email')).toBeNull();
  });
});
