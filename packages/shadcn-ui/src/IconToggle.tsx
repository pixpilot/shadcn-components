import type { ToggleButtonProps } from './ToggleButton';
import React from 'react';
import { ToggleButton } from './ToggleButton';
import { isSvgMarkupString, svgMarkupToMaskUrl } from './utils';

export interface IconToggleProps extends Omit<
  ToggleButtonProps,
  'checkedContent' | 'uncheckedContent'
> {
  checkedIcon?: React.ReactNode | string;
  uncheckedIcon?: React.ReactNode | string;

  size?: 'sm' | 'default' | 'lg';
  iconSize?: string | number;
}

export const IconToggle = React.forwardRef<HTMLButtonElement, IconToggleProps>(
  (
    {
      checkedIcon,
      uncheckedIcon,
      size = 'default',
      variant = 'outline',
      iconSize,
      style,
      className,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'size-7',
      default: 'size-9',
      lg: 'size-11',
    };

    const sizeMap = {
      sm: '14px',
      default: '16px',
      lg: '20px',
    };

    const resolvedIconSize = iconSize ?? sizeMap[size];

    const renderIcon = (icon: React.ReactNode | string | undefined): React.ReactNode => {
      if (icon == null) return null;
      if (typeof icon === 'string' && isSvgMarkupString(icon)) {
        const mask = svgMarkupToMaskUrl(icon);
        return (
          <span
            aria-hidden="true"
            className="inline-block"
            style={{
              width: 'var(--icon-size)',
              height: 'var(--icon-size)',
              flexShrink: 0,
              backgroundColor: 'currentColor',
              WebkitMaskImage: mask,
              maskImage: mask,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
        );
      }
      return icon;
    };

    return (
      <ToggleButton
        ref={ref}
        {...props}
        checkedContent={renderIcon(checkedIcon)}
        uncheckedContent={renderIcon(uncheckedIcon)}
        variant={variant}
        style={{
          ...(style ?? {}),
          ['--icon-size' as any]: resolvedIconSize,
        }}
        className={[
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
          '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-[var(--icon-size)] [&_svg]:shrink-0',
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    );
  },
);

IconToggle.displayName = 'IconToggle';
