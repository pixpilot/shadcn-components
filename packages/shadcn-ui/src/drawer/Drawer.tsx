import {
  Drawer as BaseDrawer,
  DrawerClose as BaseDrawerClose,
  DrawerContent as BaseDrawerContent,
  cn,
} from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import * as React from 'react';

/**
 * Shared by every drawer part so `noDrag` set on the root propagates down
 * without threading props by hand. The root provides its `noDrag` value here;
 * each part ORs it with its own local `noDrag` prop.
 */
const DrawerNoDragContext = React.createContext(false);

/**
 * Vaul decides whether a pointer-down starts a drag in its internal
 * `shouldDrag`. For `left`/`right` drawers that check returns `true` before it
 * ever looks at highlighted text, so selecting text inside the panel drags the
 * whole drawer. The one escape hatch vaul honours is the `data-vaul-no-drag`
 * attribute (matched via `.closest()`, so it also covers descendants). This
 * helper renders that attribute when either the root context or the part's own
 * `noDrag` prop is set, and nothing otherwise.
 */
function useNoDragProps(local?: boolean): { 'data-vaul-no-drag'?: '' } {
  const inherited = React.use(DrawerNoDragContext);
  return inherited || local ? { 'data-vaul-no-drag': '' } : {};
}

/** A drawer part that can opt out of vaul's drag-to-dismiss. */
interface NoDragProps {
  /**
   * Disable vaul's drag-to-dismiss for this element and everything inside it.
   * Useful for text editors, sliders, or any content where a press-and-move
   * gesture should select/interact instead of dragging the drawer. Setting it
   * on the `Drawer` root disables dragging for the entire drawer.
   */
  noDrag?: boolean;
}

export type DrawerProps = React.ComponentProps<typeof BaseDrawer> & NoDragProps;

/**
 * Drawer root. Wraps the vaul/Radix root and, when `noDrag` is set, disables
 * drag-to-dismiss for the whole drawer via context.
 */
export function Drawer({ noDrag = false, ...props }: DrawerProps) {
  return (
    <DrawerNoDragContext value={noDrag}>
      <BaseDrawer {...props} />
    </DrawerNoDragContext>
  );
}

export type DrawerContentProps = React.ComponentPropsWithoutRef<
  typeof BaseDrawerContent
> &
  NoDragProps & {
    /**
     * Detach the drawer from the viewport edges: adds a gap on every side and
     * rounds all corners, so it reads as a floating card rather than a panel
     * flush to the edge. Works for any `direction`. Default `true`.
     */
    floating?: boolean;

    showCloseButton?: boolean;
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
>(({ className, floating = true, showCloseButton = true, noDrag, ...props }, ref) => (
  <BaseDrawerContent
    ref={ref}
    className={cn('min-h-0 gap-4 px-6 pb-6', floating && floatingClass, className)}
    {...useNoDragProps(noDrag)}
    {...props}
  >
    {props.children}
    {showCloseButton && (
      <BaseDrawerClose
        data-slot="drawer-close"
        className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <XIcon />
        <span className="sr-only">Close</span>
      </BaseDrawerClose>
    )}
  </BaseDrawerContent>
));

DrawerContent.displayName = 'DrawerContent';

// DrawerHeader.tsx
export function DrawerHeader({
  className,
  noDrag,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & NoDragProps) {
  return (
    <div
      data-slot="header"
      className={cn('flex shrink-0 flex-col gap-2.5', className)}
      {...useNoDragProps(noDrag)}
      {...props}
    />
  );
}

// DrawerBody.tsx
export function DrawerBody({
  className,
  noDrag,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & NoDragProps) {
  return (
    <div
      data-slot="body"
      className={cn('min-h-0 flex-1 overflow-auto -mx-6 px-6', className)}
      {...useNoDragProps(noDrag)}
      {...props}
    />
  );
}

// DrawerFooter.tsx
export function DrawerFooter({
  className,
  noDrag,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & NoDragProps) {
  return (
    <div
      data-slot="footer"
      className={cn('flex shrink-0 justify-end space-x-2', className)}
      {...useNoDragProps(noDrag)}
      {...props}
    />
  );
}

export function DrawerClose({
  className,
  noDrag,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDrawerClose> & NoDragProps) {
  return (
    <BaseDrawerClose className={cn(className)} {...useNoDragProps(noDrag)} {...props} />
  );
}
