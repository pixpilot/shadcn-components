'use client';

import type { ComponentProps } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

// import '@internal/tailwind/globals.css';
import '@internal/shadcn/styles/globals.css';

/**
 * Note: In Chrome extensions, a flicker (Flash of Wrong Theme, or FOWT) may occur on page load
 * during development mode. This is resolved in production builds where scripts are included
 * in the HTML head to apply the theme before content renders. Do not attempt to fix this in dev.
 */

export interface ThemeProviderProps extends ComponentProps<typeof NextThemesProvider> {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children } = props;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';

export { ThemeProvider };
