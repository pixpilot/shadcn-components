'use client';

import { cn, Switch } from '@pixpilot/shadcn';
import { MoonIcon, SunIcon } from 'lucide-react';
import React from 'react';

const DEFAULT_ICON_SIZE = 16;

export interface ThemeModeSwitchOutsideProps {
  /** Whether to render the sun/moon icons at all. */
  showIcons?: boolean;
  /** Icon size in pixels. */
  iconSize?: number;
  /** Wrapper class name. */
  className?: string;
  /** Class name applied to the underlying Switch. */
  switchClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** The resolved theme ("light" | "dark") */
  resolvedTheme?: string;
  /** Function to change the theme */
  setTheme?: (theme: string) => void;
}

/**
 * Light/Dark theme switch with icons outside the switch.
 * Icons flank the switch control on either side.
 * Pure component - requires resolvedTheme and setTheme props.
 */
export function ThemeModeSwitchOutside(props: ThemeModeSwitchOutsideProps) {
  const {
    showIcons = true,
    iconSize = DEFAULT_ICON_SIZE,
    className,
    switchClassName,
    disabled,
    ariaLabel = 'Toggle theme',
    resolvedTheme,
    setTheme,
  } = props;

  const isDark = resolvedTheme === 'dark';

  const onCheckedChange = (checked: boolean) => {
    setTheme?.(checked ? 'dark' : 'light');
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

  return (
    <div className={cn('inline-flex items-center gap-2 px-2', className)}>
      <SunIcon
        className={cn('transition-opacity ', isDark ? 'opacity-50  ' : 'opacity-100')}
        style={{ width: iconSize, height: iconSize }}
      />
      <Switch
        checked={isDark}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(switchClassName)}
        aria-label={ariaLabel}
      />
      <MoonIcon
        className={cn('transition-opacity', isDark ? 'opacity-100' : 'opacity-50')}
        style={{ width: iconSize, height: iconSize }}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

ThemeModeSwitchOutside.displayName = 'ThemeModeSwitchOutside';
