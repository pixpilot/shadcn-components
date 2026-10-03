import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardMain,
  DashboardSidebar,
  DashboardSidebarBottom,
  DashboardSidebarTop,
} from '../src';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Dashboard>;

const navLinkClass =
  'block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors';

function SidebarTopContent() {
  return (
    <nav className="flex flex-col gap-1">
      <a href="#overview" className={navLinkClass}>
        Overview
      </a>
      <a href="#applications" className={navLinkClass}>
        Applications
      </a>
      <a href="#resumes" className={navLinkClass}>
        Resumes
      </a>
      <a href="#settings" className={navLinkClass}>
        Settings
      </a>
    </nav>
  );
}

function SidebarBottomContent() {
  return (
    <div className="flex items-center gap-3">
      <div className="border-border bg-background flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold">
        U
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">Jane Doe</div>
        <div className="text-muted-foreground truncate text-xs">jane@example.com</div>
      </div>
    </div>
  );
}

/**
 * Full dashboard shell. On desktop the sidebar top stays pinned to the top and
 * the sidebar bottom is pinned to the bottom. On small screens open the menu
 * (hamburger) — the two sections stack, separated by a divider.
 */
export const Default: Story = {
  render: () => (
    <Dashboard>
      <DashboardSidebar>
        <DashboardSidebarTop>
          <SidebarTopContent />
        </DashboardSidebarTop>

        <DashboardSidebarBottom>
          <SidebarBottomContent />
        </DashboardSidebarBottom>
      </DashboardSidebar>

      <DashboardContent>
        <DashboardHeader>
          <button
            type="button"
            className="border-border bg-background flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold"
            aria-label="User menu"
          >
            U
          </button>
        </DashboardHeader>

        <DashboardMain>
          <h1 className="text-2xl font-semibold">Page content</h1>
          <p className="text-muted-foreground mt-2">
            The sidebar bottom section should sit at the very bottom of the sidebar on
            desktop.
          </p>
        </DashboardMain>
      </DashboardContent>
    </Dashboard>
  ),
};
