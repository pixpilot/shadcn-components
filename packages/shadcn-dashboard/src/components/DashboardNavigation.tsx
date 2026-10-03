'use client';
import { Button, cn } from '@pixpilot/shadcn-ui';

import React from 'react';

export interface DashboardItem {
  href: string;
  label: string;
  location?: 'top' | 'bottom';
  icon: React.ReactNode;
  /**
   * Active only on `href` itself, not on the routes beneath it. Set it on a
   * root item (e.g. `/dashboard`) whose path prefixes every other item, or it
   * would stay highlighted on every page.
   */
  exact?: boolean;
  /**
   * Sections nested under this item, revealed only while the item itself is
   * the active one — so a multi-screen area can be moved between without
   * going back out to its landing page first.
   */
  children?: DashboardItem[];
}

export interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {
  location?: DashboardItem['location'];
  items: DashboardItem[];
  pathname: string;
  onItemClick?: (item: DashboardItem) => void;
}

function isItemActive(item: DashboardItem, pathname: string): boolean {
  return item.exact === true ? pathname === item.href : pathname.startsWith(item.href);
}

interface DashboardNavButtonProps {
  item: DashboardItem;
  isActive: boolean;
  nested?: boolean;
  onItemClick?: (item: DashboardItem) => void;
}

const DashboardNavButton: React.FC<DashboardNavButtonProps> = ({
  isActive,
  item,
  nested = false,
  onItemClick,
}) => (
  <Button
    onClick={() => onItemClick?.(item)}
    variant={isActive ? 'outline' : 'ghost'}
    size={nested ? 'sm' : 'default'}
    aria-current={isActive ? 'page' : undefined}
    /*
     * Marks this as a thing that navigates away. These are buttons rather than
     * links (the host routes in `onItemClick`), so the mobile sidebar has no
     * other way to tell them apart from the controls that share it — a theme
     * toggle, a log-out button — which must not dismiss it.
     */
    data-dashboard-nav-item=""
    className={cn('justify-start !rounded-md border-none', {
      '!bg-primary/10 text-primary': isActive,
      'text-muted-foreground hover:bg-muted': !isActive,
    })}
  >
    {item.icon != null && <span className="mr-1">{item.icon}</span>}
    {item.label}
  </Button>
);

export const DashboardNavigationButtons: React.FC<DashboardNavProps> = ({
  items,
  pathname,
  location,
  onItemClick,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cn('flex flex-col gap-1', className)}>
      {items.map((item) => {
        if (item.location !== location) return null;
        const isActive = isItemActive(item, pathname);
        const children = isActive ? item.children : undefined;

        return (
          <React.Fragment key={item.href}>
            <DashboardNavButton
              item={item}
              isActive={isActive}
              onItemClick={onItemClick}
            />

            {children != null && children.length > 0 && (
              <div className="border-border ml-4 flex flex-col gap-1 border-l pl-2">
                {children.map((child) => (
                  <DashboardNavButton
                    key={child.href}
                    item={child}
                    nested
                    isActive={isItemActive(child, pathname)}
                    onItemClick={onItemClick}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
