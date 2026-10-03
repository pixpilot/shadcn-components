'use client';

import type { DashboardProps } from '../context/dashboard-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@pixpilot/shadcn';
import { Button, cn } from '@pixpilot/shadcn-ui';
import { Menu } from 'lucide-react';
import React from 'react';

import { DashboardProvider, useDashboard } from '../context/dashboard-context';

const DashboardLayout: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { children, ...rest } = props;
  const { setIsSidebarOpen } = useDashboard();

  return (
    <div
      {...rest}
      className={cn(
        'bg-background text-foreground h-dvh w-full max-w-full overflow-hidden antialiased transition-colors',
        props.className,
      )}
    >
      <div className="bg-background text-foreground h-full">
        <div className="flex h-full min-w-0 flex-col">
          <div className="border-border flex h-14 shrink-0 items-center border-b px-3 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open dashboard menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="ml-2 text-sm font-semibold">Dashboard</span>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<
  React.HTMLAttributes<HTMLDivElement> & DashboardProps
> = ({ logo, ...props }) => {
  return (
    <DashboardProvider logo={logo}>
      <DashboardLayout {...props} />
    </DashboardProvider>
  );
};

export const DashboardSidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const { isSidebarOpen, setIsSidebarOpen, logo } = useDashboard();

  /**
   * Dismisses the mobile sidebar once the click that navigates away has been
   * made — otherwise the sheet stays open over the page it just moved to.
   *
   * Only things that actually navigate count: a link, or a nav item from
   * {@link DashboardNavigationButtons}, which routes from an `onClick` and so
   * is a `button` rather than an `a`. The sidebar also holds controls that
   * stay on the page — the theme toggle, log out — and closing on those would
   * be wrong, so this deliberately does not match every button.
   *
   * Bound on the bubble phase, and it must stay there. Closing during capture
   * tears the sheet down before the click has reached the nav item it started
   * on, so the item's own handler — the one that routes — never runs, and the
   * menu closes without going anywhere.
   */
  const closeSidebarAfterNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a[href], [data-dashboard-nav-item]')) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <aside
        {...props}
        className={cn(
          'border-border bg-card hidden h-full w-64 shrink-0 flex-col overflow-y-auto border-r p-4 md:flex',
          props.className,
        )}
      >
        <div className="mb-4 ml-3 flex items-start gap-2">
          {logo != null && logo}
          <div className="text-lg font-semibold">Dashboard</div>
        </div>
        {children}
      </aside>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="w-72 max-w-[85vw] p-0 md:hidden"
          onClick={closeSidebarAfterNavigation}
        >
          <SheetHeader className="border-border border-b px-4 py-4">
            <SheetTitle>Dashboard</SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100dvh-4.25rem)] flex-col overflow-y-auto p-4">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

/**
 * Renders at the top of the sidebar. On desktop it sits directly below the
 * sidebar title; on small screens it stacks above the bottom section.
 */
export const DashboardSidebarTop: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <div {...props} className={cn('flex flex-col gap-2', props.className)}>
      {children}
    </div>
  );
};

/**
 * Renders at the bottom of the sidebar. On desktop (`md+`) it is pinned to the
 * bottom via `mt-auto`; on small screens it simply stacks under the top section,
 * separated by a divider.
 */
export const DashboardSidebarBottom: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn('mt-6 flex flex-col gap-2 pt-6 md:mt-auto', props.className)}
    >
      {children}
    </div>
  );
};

export const DashboardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <header
      {...props}
      className={cn(
        'border-border flex h-16 min-w-0 shrink-0 items-center justify-between gap-3 border-b px-3 sm:px-6',
        props.className,
      )}
    >
      <div className="ml-auto flex min-w-0 items-center justify-end gap-3">
        {children}
      </div>
    </header>
  );
};

export const DashboardContent: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const { children, ...rest } = props;

  return (
    <div
      {...rest}
      className={cn('flex min-h-0 min-w-0 flex-1 flex-col', props.className)}
    >
      {children}
    </div>
  );
};

export const DashboardMain: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const { children, ...rest } = props;

  return (
    <main
      {...rest}
      className={cn(
        '@container relative flex min-h-0 w-full min-w-0 flex-1 justify-start overflow-auto p-4 sm:p-6',
        props.className,
      )}
    >
      <div className="w-full">{children}</div>
    </main>
  );
};
