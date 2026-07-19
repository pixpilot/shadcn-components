import {
  DrawerClose as BaseDrawerClose,
  DrawerContent as BaseDrawerContent,
  cn,
} from '@pixpilot/shadcn';
import * as React from 'react';

export type DrawerContentProps = React.ComponentPropsWithoutRef<
  typeof BaseDrawerContent
> & {
  /**
   * Detach the drawer from the viewport edges: adds a gap on every side and
   * rounds all corners, so it reads as a floating card rather than a panel
   * flush to the edge. Works for any `direction`. Default `true`.
   */
  floating?: boolean;
};

/**
 * Direction-aware "floating" overrides. Each rule targets vaul's
 * `data-vaul-drawer-direction` attribute so a single set of classes works
 * regardless of which edge the drawer root anchors to. Per-corner radius
 * classes (`rounded-t-*`/`rounded-b-*`) are used for the top/bottom directions
 * so they deterministically override the registry's `rounded-t-lg`/`rounded-b-lg`.
 */
const floatingClass = cn(
  'overflow-hidden border shadow-lg',
  'data-[vaul-drawer-direction=bottom]:inset-x-3 data-[vaul-drawer-direction=bottom]:bottom-3 data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:rounded-b-2xl',
  'data-[vaul-drawer-direction=top]:inset-x-3 data-[vaul-drawer-direction=top]:top-3 data-[vaul-drawer-direction=top]:rounded-t-2xl data-[vaul-drawer-direction=top]:rounded-b-2xl',
  'data-[vaul-drawer-direction=right]:inset-y-3 data-[vaul-drawer-direction=right]:right-3 data-[vaul-drawer-direction=right]:rounded-2xl',
  'data-[vaul-drawer-direction=left]:inset-y-3 data-[vaul-drawer-direction=left]:left-3 data-[vaul-drawer-direction=left]:rounded-2xl',
);

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof BaseDrawerContent>,
  DrawerContentProps
>(({ className, floating = true, ...props }, ref) => (
  <BaseDrawerContent
    ref={ref}
    className={cn('min-h-0 gap-4 px-6 pb-6', floating && floatingClass, className)}
    {...props}
  />
));

DrawerContent.displayName = 'DrawerContent';

// DrawerHeader.tsx
export function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="header"
      className={cn('flex shrink-0 flex-col gap-2.5', className)}
      {...props}
    />
  );
}

// DrawerBody.tsx
export function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="body"
      className={cn('min-h-0 flex-1 overflow-auto -mx-6 px-6', className)}
      {...props}
    />
  );
}

// DrawerFooter.tsx
export function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="footer"
      className={cn('flex shrink-0 justify-end space-x-2', className)}
      {...props}
    />
  );
}

export function DrawerClose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDrawerClose>) {
  return <BaseDrawerClose className={cn(className)} {...props} />;
}
