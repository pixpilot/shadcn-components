import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { DashboardSidebarUser } from '../src/components/DashboardSidebarUser';

describe('dashboardSidebarUser', () => {
  it('should render the name, its initials and the subtitle', () => {
    render(<DashboardSidebarUser name="Jane Doe" subtitle="Admin" />);

    expect(screen.getByText('Jane Doe')).toHaveAttribute('title', 'Jane Doe');
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should show the fallback name when the user has none', () => {
    render(<DashboardSidebarUser name={null} fallbackName="Guest" />);

    expect(screen.getByText('Guest')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should show a skeleton instead of the user while loading', () => {
    const { container } = render(<DashboardSidebarUser name="Jane Doe" isLoading />);

    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(screen.queryByText('Jane Doe')).toBeNull();
  });

  it('should render the actions passed as children', () => {
    render(
      <DashboardSidebarUser name="Jane Doe">
        <button type="button">Log out</button>
      </DashboardSidebarUser>,
    );

    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });
});
