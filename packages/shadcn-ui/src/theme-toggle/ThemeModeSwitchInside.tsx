'use client';

import { cn, Switch } from '@pixpilot/shadcn';
import { MoonIcon, SunIcon } from 'lucide-react';

const DEFAULT_ICON_SIZE = 16;

const TOGGLE_WRAPPER_CLASS_NAME = cn(
  'relative inline-flex items-center gap-1 rounded-full border border-border p-1 bg-transparent',
);

const ICON_CLASS_NAME = cn('pointer-events-none rounded-full transition-colors');

const SWITCH_OVERLAY_CLASS_NAME = cn(
  'absolute inset-0 h-full w-full opacity-0 cursor-pointer rounded-full',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'ring-offset-background disabled:cursor-not-allowed',
);

export type ThemeModeSwitchInsideSize = 'sm' | 'md' | 'lg';

const SIZE_STYLES: Record<
  ThemeModeSwitchInsideSize,
  { wrapper: string; iconPadding: string; defaultIconSize: number }
> = {
  sm: {
    wrapper: 'h-7',
    iconPadding: 'p-1',
    defaultIconSize: 20,
  },
  // Match common input height (~34px)
  md: {
    wrapper: 'h-8/5',
    iconPadding: 'p-1',
    defaultIconSize: 24,
  },
  lg: {
    wrapper: 'h-10 p-1.5 gap-1.5',
    iconPadding: 'p-1.5',
    defaultIconSize: 30,
  },
};

export interface ThemeModeSwitchInsideProps {
  /** Whether to render the sun/moon icons at all. */
  showIcons?: boolean;
  /** Visual size of the toggle pill. */
  size?: ThemeModeSwitchInsideSize;
  /** Icon size in pixels. */
  iconSize?: number;
  /** Wrapper class name. */
  className?: string;
  /** Class name applied to the underlying Switch. */
  switchClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** The resolved theme value ("light" | "dark") */
  value?: string;
  /** Function to change the theme */
  onChange?: (theme: string) => void;
}

/**
 * Light/Dark theme switch with icons inside the switch.
 * Icons are embedded within the switch control.
 * Pure component - requires value and onChange props.
 */
export function ThemeModeSwitchInside(props: ThemeModeSwitchInsideProps) {
  const {
    showIcons = true,
    size = 'md',
    iconSize: iconSizeProp,
    className,
    switchClassName,
    disabled,
    ariaLabel = 'Toggle theme',
    value,
    onChange,
  } = props;

  const sizeStyles = SIZE_STYLES[size];
  const iconSize = iconSizeProp ?? sizeStyles.defaultIconSize ?? DEFAULT_ICON_SIZE;

  const isDark = value === 'dark';

  const onCheckedChange = (checked: boolean) => {
    onChange?.(checked ? 'dark' : 'light');
  };

  if (!showIcons) {
    return (
      <Switch
        checked={isDark}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(switchClassName)}
        aria-label={ariaLabel}
      />
    );
  }

  const sunClassName = cn(
    ICON_CLASS_NAME,
    sizeStyles.iconPadding,
    isDark ? 'text-muted-foreground' : 'bg-primary/10 text-accent-foreground',
  );

  const moonClassName = cn(
    ICON_CLASS_NAME,
    sizeStyles.iconPadding,
    isDark ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
  );

  return (
    <div
      className={cn(
        TOGGLE_WRAPPER_CLASS_NAME,
        sizeStyles.wrapper,
        disabled && 'opacity-50',
        className,
      )}
    >
      <Switch
        checked={isDark}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(SWITCH_OVERLAY_CLASS_NAME, switchClassName)}
        aria-label={ariaLabel}
      />
      <SunIcon className={sunClassName} style={{ width: iconSize, height: iconSize }} />
      <MoonIcon className={moonClassName} style={{ width: iconSize, height: iconSize }} />
    </div>
  );
}

ThemeModeSwitchInside.displayName = 'ThemeModeSwitchInside';
