import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { DashboardCard } from '../src/components/DashboardCard';

describe('dashboardCard', () => {
  it('should render the title, description, action and body', () => {
    render(
      <DashboardCard
        title="Profile"
        description="Your public details."
        action={<button type="button">Edit</button>}
      >
        <p>Body</p>
      </DashboardCard>,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Profile' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Your public details.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('should omit the heading row when there is no title, description or action', () => {
    render(
      <DashboardCard>
        <p>Body only</p>
      </DashboardCard>,
    );

    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Body only')).toBeInTheDocument();
  });

  it('should style the title as destructive for a dangerous section', () => {
    render(<DashboardCard title="Delete account" destructive />);

    expect(screen.getByRole('heading', { name: 'Delete account' })).toHaveClass(
      'text-destructive',
    );
  });
});
