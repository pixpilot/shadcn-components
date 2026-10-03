import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { DashboardPageHeader } from '../src/components/DashboardPageHeader';

describe('dashboardPageHeader', () => {
  it('should render the title as the page heading', () => {
    render(<DashboardPageHeader title="Account Settings" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Account Settings' }),
    ).toBeInTheDocument();
  });

  it('should render the description when one is given', () => {
    render(
      <DashboardPageHeader
        title="Credits"
        description="Your balance and everything that has used it."
      />,
    );

    expect(
      screen.getByText('Your balance and everything that has used it.'),
    ).toBeInTheDocument();
  });

  it('should omit the description paragraph when none is given', () => {
    const { container } = render(<DashboardPageHeader title="Jobs" />);

    expect(container.querySelector('p')).toBeNull();
  });

  it('should render the icon and the actions alongside the title', () => {
    render(
      <DashboardPageHeader
        title="Vouchers"
        icon={<span data-testid="header-icon" />}
        actions={<button type="button">Add Voucher</button>}
      />,
    );

    expect(screen.getByTestId('header-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Voucher' })).toBeInTheDocument();
  });

  it('should drop to the requested heading level for a nested header', () => {
    render(<DashboardPageHeader as="h2" title="Users" />);

    expect(screen.getByRole('heading', { level: 2, name: 'Users' })).toBeInTheDocument();
  });

  it('should merge a caller className onto the root element', () => {
    const { container } = render(
      <DashboardPageHeader title="Resumes" className="mb-6" />,
    );

    expect(container.firstElementChild).toHaveClass('mb-6');
  });
});
