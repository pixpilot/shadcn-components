import type { DashboardItem } from '../src/components/DashboardNavigation';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardNavigationButtons } from '../src/components/DashboardNavigation';

const items: DashboardItem[] = [
  { href: '/admin/users', label: 'Users', icon: null },
  {
    href: '/admin/ai-evaluation',
    label: 'AI Evaluation',
    icon: null,
    children: [
      { href: '/admin/ai-evaluation/models', label: 'Model registry', icon: null },
      { href: '/admin/ai-evaluation/runs', label: 'Evaluation runs', icon: null },
    ],
  },
];

describe('dashboardNavigationButtons', () => {
  it('should hide nested items while their parent is not the active item', () => {
    render(<DashboardNavigationButtons items={items} pathname="/admin/users" />);

    expect(screen.getByRole('button', { name: 'AI Evaluation' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Model registry' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Evaluation runs' })).toBeNull();
  });

  it('should reveal nested items on the parent route', () => {
    render(<DashboardNavigationButtons items={items} pathname="/admin/ai-evaluation" />);

    expect(screen.getByRole('button', { name: 'Model registry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Evaluation runs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Model registry' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('should mark the nested item owning the route, including its detail pages', () => {
    render(
      <DashboardNavigationButtons
        items={items}
        pathname="/admin/ai-evaluation/models/openai/gpt-4"
      />,
    );

    expect(screen.getByRole('button', { name: 'Model registry' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Evaluation runs' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('button', { name: 'AI Evaluation' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('should report the nested item that was clicked', () => {
    const onItemClick = vi.fn();

    render(
      <DashboardNavigationButtons
        items={items}
        pathname="/admin/ai-evaluation"
        onItemClick={onItemClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Evaluation runs' }));

    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ href: '/admin/ai-evaluation/runs' }),
    );
  });

  it('should match an exact item only on its own route', () => {
    const dashboardItems: DashboardItem[] = [
      { href: '/dashboard', label: 'Resume', icon: null, exact: true },
      { href: '/dashboard/jobs', label: 'Jobs', icon: null },
    ];

    render(
      <DashboardNavigationButtons items={dashboardItems} pathname="/dashboard/jobs" />,
    );

    expect(screen.getByRole('button', { name: 'Resume' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('button', { name: 'Jobs' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('should match a non-exact item on the routes beneath it', () => {
    const dashboardItems: DashboardItem[] = [
      { href: '/dashboard', label: 'Home', icon: null },
    ];

    render(
      <DashboardNavigationButtons items={dashboardItems} pathname="/dashboard/jobs" />,
    );

    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('should render only the items for the requested location', () => {
    const locatedItems: DashboardItem[] = [
      { href: '/a', label: 'Top item', icon: null, location: 'top' },
      { href: '/b', label: 'Bottom item', icon: null, location: 'bottom' },
    ];

    render(
      <DashboardNavigationButtons items={locatedItems} location="bottom" pathname="/" />,
    );

    expect(screen.getByRole('button', { name: 'Bottom item' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Top item' })).toBeNull();
  });
});
