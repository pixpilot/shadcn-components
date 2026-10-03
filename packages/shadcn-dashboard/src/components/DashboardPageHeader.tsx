'use client';

import type { ReactNode } from 'react';
import { cn } from '@pixpilot/shadcn-ui';

export interface DashboardPageHeaderProps {
  /** The page title. */
  title: ReactNode;
  /** Optional supporting text under the title (may contain links, etc.). */
  description?: ReactNode;
  /** Rendered inside a bordered tile to the left of the title. */
  icon?: ReactNode;
  /** Page-level actions, right-aligned beside the title when there is room. */
  actions?: ReactNode;
  /**
   * Heading level. `h1` is right for a page's own header; drop to `h2` only
   * when the header sits inside a page that already owns the `h1`.
   */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/**
 * The header every dashboard and admin page opens with: a title, optional
 * description, an optional icon tile, and optional actions.
 *
 * Centralising it is what keeps the title size, the muted description and the
 * action row identical on every screen rather than each page re-deciding. The
 * header declares its own `@container` so the actions drop under the title on a
 * narrow page without the caller having to provide one.
 */
export function DashboardPageHeader({
  title,
  description,
  icon,
  actions,
  as: Heading = 'h1',
  className,
}: DashboardPageHeaderProps): ReactNode {
  return (
    <div className={cn('@container', className)}>
      <div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {icon != null && (
            <div className="bg-muted/50 text-muted-foreground flex size-11 shrink-0 items-center justify-center rounded-lg border">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <Heading className="text-2xl font-semibold tracking-tight">{title}</Heading>
            {description != null && (
              <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            )}
          </div>
        </div>

        {actions != null && (
          <div className="flex flex-wrap items-center gap-2 @md:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

DashboardPageHeader.displayName = 'DashboardPageHeader';
