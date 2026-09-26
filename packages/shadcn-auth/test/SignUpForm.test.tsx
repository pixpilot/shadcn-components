import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SignUpForm } from '../src/components/SignUpForm';

describe('signUpForm', () => {
  it('should show a confirmation receipt supplied by the host', () => {
    render(
      <SignUpForm
        onSignUp={vi.fn(async () => undefined)}
        isLoading={false}
        error={null}
        sentTo="ada@example.com"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeDefined();
    expect(screen.getByText('ada@example.com')).toBeDefined();
    expect(screen.queryByLabelText('Email')).toBeNull();
  });
});
