'use client';

import type React from 'react';
import type { ReactNode } from 'react';

import { Card, CardContent, cn } from '@pixpilot/shadcn-ui';

export interface DashboardCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Section heading. Omitted when the body already renders its own. */
  title?: ReactNode;
  /** Supporting copy under the heading. */
  description?: ReactNode;
  /** Controls pinned to the top-right of the card, opposite the heading. */
  action?: ReactNode;
  /** Renders the card as dangerous — used for destructive sections. */
  destructive?: boolean;
  children?: ReactNode;
}

/**
 * The card a dashboard section sits in.
 *
 * Owning the shell here is what keeps sections aligned: one padding, one
 * heading style, one place to change them. Feature packages render their body
 * only and export their copy, so the heading and any action always come from
 * the host — see `DashboardCardProps.title` and `action`.
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  action,
  destructive = false,
  className,
  children,
  ...other
}) => {
  const hasHeading = title != null || description != null || action != null;

  return (
    <Card className={cn(destructive && 'border-destructive/50', className)} {...other}>
      <CardContent className="flex flex-col gap-4 px-6 py-0">
        {hasHeading && (
          <div className="flex items-start justify-between gap-4">
            <div>
              {title != null && (
                <h3
                  className={cn('text-lg font-medium', destructive && 'text-destructive')}
                >
                  {title}
                </h3>
              )}
              {description != null && (
                <p className="text-muted-foreground mt-1 text-sm">{description}</p>
              )}
            </div>
            {action != null && (
              <div className="flex shrink-0 flex-col gap-2">{action}</div>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

DashboardCard.displayName = 'DashboardCard';
