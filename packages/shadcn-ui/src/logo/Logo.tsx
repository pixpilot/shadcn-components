import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@pixpilot/shadcn';

/** Icon edge in pixels when no `size` is given. */
const DEFAULT_LOGO_SIZE = 24;

export interface LogoProps extends Omit<ComponentProps<'img'>, 'alt'> {
  /** Edge length in pixels; the icon is square. */
  size?: number;
}

/**
 * The app icon. One component everywhere, sized per place, so the brand looks
 * the same in the navbar, the sign-in card and the dashboard sidebar.
 *
 * Defaults to `/favicon.svg`; pass `src` where the icon is served elsewhere,
 * such as in a Chrome extension.
 */
export function Logo({
  size = DEFAULT_LOGO_SIZE,
  src = '/favicon.svg',
  className,
  style,
  ...props
}: LogoProps) {
  return (
    // A plain `<img>`, not `next/image`, so it also works outside Next.js.
    <img
      width={size}
      height={size}
      {...props}
      src={src}
      style={{ width: size, height: size, ...style }}
      className={cn('shrink-0', className)}
      // Decorative: the brand name next to it, or the link around it, names it.
      alt=""
      aria-hidden="true"
    />
  );
}

export interface BrandLogoProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** The brand name shown next to the icon, usually the app name. */
  name: ReactNode;
  /** The icon's edge in pixels; scale the text with `className`. */
  size?: number;
  /** Passed to the icon, e.g. its `src` in a Chrome extension. */
  logoProps?: Omit<LogoProps, 'size'>;
}

/** The icon with the brand name beside it. Wrap it in a link where it navigates. */
export function BrandLogo({
  name,
  size,
  logoProps,
  className,
  ...props
}: BrandLogoProps) {
  return (
    <span
      {...props}
      className={cn(
        'text-foreground inline-flex items-center gap-2 font-bold',
        className,
      )}
    >
      <Logo {...logoProps} {...(size !== undefined && { size })} />
      <span>{name}</span>
    </span>
  );
}
