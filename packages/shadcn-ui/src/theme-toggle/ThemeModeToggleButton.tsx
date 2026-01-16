'use client';

import { Button, cn } from '@pixpilot/shadcn';
import { MoonIcon, SunIcon } from 'lucide-react';
import React from 'react';

export interface ThemeModeToggleButtonProps {
  className?: string;
  /** The resolved theme ("light" | "dark") */
  resolvedTheme?: string;
  /** Function to change the theme */
  setTheme?: (theme: string) => void;
  disabled?: boolean;
}

/**
 * Light/Dark toggle button.
 * Pure component - toggles between light and dark.
 */
export function ThemeModeToggleButton(props: ThemeModeToggleButtonProps) {
  const { className, resolvedTheme, setTheme, disabled } = props;

  const toggleTheme = React.useCallback(() => {
    if (resolvedTheme === 'dark') {
      setTheme?.('light');
      return;
    }

    setTheme?.('dark');
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn('group/toggle size-8', className)}
      onClick={toggleTheme}
      type="button"
      disabled={disabled}
    >
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

ThemeModeToggleButton.displayName = 'ThemeModeToggleButton';
