'use client';

import type { ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@pixpilot/shadcn';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';

import { getInitials } from '../utils/get-initials';

export interface DashboardSidebarUserProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** The signed-in user's display name. Its initials fill the avatar. */
  name?: string | null;
  /** Shown in place of `name` when the user has none. */
  fallbackName?: string;
  /** A muted line under the name, e.g. the user's role. */
  subtitle?: ReactNode;
  /** Renders a skeleton in place of the avatar and name. */
  isLoading?: boolean;
  /** Controls in a row under the user, e.g. a theme toggle and log out. */
  children?: ReactNode;
}

/**
 * The account block at the foot of the sidebar. It only renders: the host
 * supplies the user and the actions, since signing out is app-specific.
 */
const DashboardSidebarUser: React.FC<DashboardSidebarUserProps> = ({
  name,
  fallbackName = 'Your account',
  subtitle,
  isLoading = false,
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cn('flex flex-col gap-3', className)}>
      {isLoading ? (
        <div className="flex items-center gap-3 px-1" aria-busy="true">
          <div className="bg-muted h-8 w-8 shrink-0 animate-pulse rounded-full" />
          <div className="bg-muted h-3 w-28 animate-pulse rounded" />
        </div>
      ) : (
        <div className="flex min-w-0 items-center gap-3 px-1">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" title={name ?? undefined}>
              {name ?? fallbackName}
            </p>
            {subtitle != null && (
              <p className="text-muted-foreground text-xs">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {children != null && (
        <div className="flex items-center justify-between gap-2 px-1">{children}</div>
      )}
    </div>
  );
};

DashboardSidebarUser.displayName = 'DashboardSidebarUser';

export { DashboardSidebarUser };
