import {
  Drawer as BaseDrawer,
  DrawerClose as BaseDrawerClose,
  DrawerContent as BaseDrawerContent,
  cn,
} from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { isToastInteractionTarget } from '../overlay-panel/overlay-interaction';
import {
  OverlayPanelBody,
  OverlayPanelFooter,
  OverlayPanelHeader,
} from '../overlay-panel/OverlayPanel';

/**
 * Shared by every drawer part so `noDrag` set on the root propagates down
 * without threading props by hand. The root provides its `noDrag` value here;
 * each part ORs it with its own local `noDrag` prop.
 */
const DrawerNoDragContext = React.createContext(false);

/**
 * Vaul injects a global `@media (hover:hover) and (pointer:fine) {
 * [data-vaul-drawer] { user-select: none } }` rule so a drag never leaves a
 * trail of highlighted text. That rule is unlayered, so it outranks Tailwind's
 * `@layer utilities` output no matter the class — an inline style is the only
 * reliable override. Since a `noDrag` element cannot be dragged, selection is
 * re-enabled there; `text` (rather than `auto`) is used because `auto` would
 * resolve back to `none` when the drawer content above it is still unselectable.
 */
const selectableStyle: React.CSSProperties = { userSelect: 'text' };

/**
 * Vaul decides whether a pointer-down starts a drag in its internal
 * `shouldDrag`. For `left`/`right` drawers that check returns `true` before it
 * ever looks at highlighted text, so selecting text inside the panel drags the
 * whole drawer. The one escape hatch vaul honours is the `data-vaul-no-drag`
 * attribute (matched via `.closest()`, so it also covers descendants). This
 * helper renders that attribute — plus the `user-select` reset described above
 * — when either the root context or the part's own `noDrag` prop is set, and
 * passes `style` straight through otherwise.
 */
function useNoDragProps(
  local: boolean | undefined,
  style: React.CSSProperties | undefined,
): { 'data-vaul-no-drag'?: ''; style?: React.CSSProperties } {
  const inherited = React.use(DrawerNoDragContext);
  if (!inherited && !local) return { style };
  return { 'data-vaul-no-drag': '', style: { ...selectableStyle, ...style } };
}

/** A drawer part that can opt out of vaul's drag-to-dismiss. */
interface NoDragProps {
  /**
   * Disable vaul's drag-to-dismiss for this element and everything inside it,
   * and restore text selection (vaul disables it while a drawer is open).
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
>(
  (
    {
      className,
      floating = true,
      showCloseButton = true,
      noDrag,
      style,
      onPointerDownOutside,
      ...props
    },
    ref,
  ) => {
    const handleOnPointerDownOutside = React.useCallback(
      (event: Parameters<NonNullable<DrawerContentProps['onPointerDownOutside']>>[0]) => {
        onPointerDownOutside?.(event);
        if (isToastInteractionTarget(event.target)) {
          event.preventDefault();
        }
      },
      [onPointerDownOutside],
    );

    return (
      <BaseDrawerContent
        ref={ref}
        className={cn('min-h-0 gap-4 px-6 pb-6', floating && floatingClass, className)}
        {...useNoDragProps(noDrag, style)}
        onPointerDownOutside={handleOnPointerDownOutside}
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
    );
  },
);

DrawerContent.displayName = 'DrawerContent';

// DrawerHeader.tsx
export function DrawerHeader({
  noDrag,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & NoDragProps) {
  return (
    <OverlayPanelHeader
      data-slot="drawer-header"
      {...useNoDragProps(noDrag, style)}
      {...props}
    />
  );
}

// DrawerBody.tsx
export function DrawerBody({
  noDrag,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & NoDragProps) {
  return (
    <OverlayPanelBody
      data-slot="drawer-body"
      {...useNoDragProps(noDrag, style)}
      {...props}
    />
  );
}

// DrawerFooter.tsx
export function DrawerFooter({
  noDrag,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & NoDragProps) {
  return (
    <OverlayPanelFooter
      data-slot="drawer-footer"
      {...useNoDragProps(noDrag, style)}
      {...props}
    />
  );
}

export function DrawerClose({
  className,
  noDrag,
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDrawerClose> & NoDragProps) {
  return (
    <BaseDrawerClose
      className={cn(className)}
      {...useNoDragProps(noDrag, style)}
      {...props}
    />
  );
}
