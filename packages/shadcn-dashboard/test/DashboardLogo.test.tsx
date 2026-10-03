import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardLogo } from '../src/components/DashboardLogo';

describe('dashboardLogo', () => {
  it('should render the logo passed as children inside a button', () => {
    render(
      <DashboardLogo aria-label="Home">
        <svg data-testid="logo" />
      </DashboardLogo>,
    );

    expect(screen.getByRole('button', { name: 'Home' })).toContainElement(
      screen.getByTestId('logo'),
    );
  });

  it('should call onClick so the host can route', () => {
    const onClick = vi.fn();

    render(<DashboardLogo aria-label="Home" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Home' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('should merge a caller className with its own', () => {
    render(<DashboardLogo aria-label="Home" className="custom" />);

    expect(screen.getByRole('button', { name: 'Home' })).toHaveClass(
      'custom',
      'rounded-full',
    );
  });
});
