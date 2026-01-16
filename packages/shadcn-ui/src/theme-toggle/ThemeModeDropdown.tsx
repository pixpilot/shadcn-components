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
  /** Current theme selection ("light" | "dark" | "system") */
  themeValue?: string;
  /** Function to change the theme */
  onChange?: (theme: string) => void;
  /** The resolved theme value ("light" | "dark") */
  value?: string;
  disabled?: boolean;
}

/**
 * Theme mode selector dropdown.
 * Provides Light / Dark / System options.
 * Pure component - requires themeValue and onChange props.
 */
export function ThemeModeDropdown(props: ThemeModeDropdownProps) {
  const { align = 'end', className, themeValue, onChange, value, disabled } = props;

  const isDark = value === 'dark';

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
        <DropdownMenuItem onClick={() => onChange?.('light')}>
          <Sun className="h-4 w-4 mr-2" />
          <span className="flex-1">Light</span>
          {themeValue === 'light' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange?.('dark')}>
          <Moon className="h-4 w-4 mr-2" />
          <span className="flex-1">Dark</span>
          {themeValue === 'dark' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange?.('system')}>
          <Monitor className="h-4 w-4 mr-2" />
          <span className="flex-1">System</span>
          {themeValue === 'system' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ThemeModeDropdown.displayName = 'ThemeModeDropdown';
