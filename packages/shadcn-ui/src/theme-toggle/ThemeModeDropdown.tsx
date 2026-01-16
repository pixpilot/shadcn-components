'use client';

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pixpilot/shadcn';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import React from 'react';

export interface ThemeModeDropdownProps {
  align?: 'start' | 'center' | 'end';
  className?: string;
  /** Current theme value ("light" | "dark" | "system") */
  theme?: string;
  /** Function to change the theme */
  setTheme?: (theme: string) => void;
  /** The resolved theme ("light" | "dark") */
  resolvedTheme?: string;
  disabled?: boolean;
}

/**
 * Theme mode selector dropdown.
 * Provides Light / Dark / System options.
 * Pure component - requires theme and setTheme props.
 */
export function ThemeModeDropdown(props: ThemeModeDropdownProps) {
  const { align = 'end', className, theme, setTheme, resolvedTheme, disabled } = props;

  const isDark = resolvedTheme === 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(className)}
          disabled={disabled}
        >
          <Sun
            className={cn(
              'h-[1.2rem] w-[1.2rem] transition-all',
              isDark ? 'scale-0 -rotate-90' : 'scale-100 rotate-0',
            )}
          />
          <Moon
            className={cn(
              'absolute h-[1.2rem] w-[1.2rem] transition-all',
              isDark ? 'scale-100 rotate-0' : 'scale-0 rotate-90',
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem onClick={() => setTheme?.('light')}>
          <Sun className="h-4 w-4 mr-2" />
          <span className="flex-1">Light</span>
          {theme === 'light' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme?.('dark')}>
          <Moon className="h-4 w-4 mr-2" />
          <span className="flex-1">Dark</span>
          {theme === 'dark' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme?.('system')}>
          <Monitor className="h-4 w-4 mr-2" />
          <span className="flex-1">System</span>
          {theme === 'system' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ThemeModeDropdown.displayName = 'ThemeModeDropdown';
