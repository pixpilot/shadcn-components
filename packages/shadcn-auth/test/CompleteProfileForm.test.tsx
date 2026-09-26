import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CompleteProfileForm } from '../src/components/CompleteProfileForm';

const HOST_NAME_LIMIT = 40;

function renderForm(
  props: Partial<React.ComponentProps<typeof CompleteProfileForm>> = {},
) {
  const onSubmit = vi.fn(async () => undefined);
  render(
    <CompleteProfileForm
      onSubmit={onSubmit}
      maxDisplayNameLength={HOST_NAME_LIMIT}
      isLoading={false}
      error={null}
      {...props}
    />,
  );
  return { onSubmit };
}

describe('completeProfileForm', () => {
  it('should submit the trimmed name', () => {
    const { onSubmit } = renderForm();

    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: '  Ada Lovelace  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/iu }));

    expect(onSubmit).toHaveBeenCalledWith('Ada Lovelace');
  });

  it('should refuse a blank name', () => {
    const { onSubmit } = renderForm();

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/iu }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe('Please enter your name');
  });

  it('should use the host-provided name limit for input and validation', () => {
    const { onSubmit } = renderForm({ maxDisplayNameLength: 4 });
    const input = screen.getByLabelText('Full name');
    expect(input.getAttribute('maxLength')).toBe('4');
    // The input caps typing at the limit, so the over-length value is set
    // directly — the guard has to hold even when maxLength is bypassed.
    fireEvent.change(input, {
      target: { value: 'a'.repeat(5) },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/iu }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('4 characters or fewer');
  });

  it('should tell the user which account they are finishing', () => {
    renderForm({ email: 'ada@example.com' });

    expect(screen.getByText('Finishing sign-in for ada@example.com.')).toBeDefined();
  });

  it('should prefill a partial name a provider supplied', () => {
    renderForm({ defaultName: 'Ada' });

    expect(screen.getByLabelText<HTMLInputElement>('Full name').value).toBe('Ada');
  });

  it('should surface a server error', () => {
    renderForm({ error: 'Something went wrong. Please try again.' });

    expect(screen.getByText('Something went wrong. Please try again.')).toBeDefined();
  });

  it('should disable submission while the host reports work in flight', () => {
    renderForm({ isLoading: true });

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });
});
