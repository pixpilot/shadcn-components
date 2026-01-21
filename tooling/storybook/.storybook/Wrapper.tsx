import { ThemeProvider } from '@pixpilot/shadcn-ui';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';

import { Toaster } from 'sonner';

export interface WrapperProps {
  children: React.ReactNode;
}

/**
 * Inner component that syncs Storybook's toolbar theme button with next-themes.
 *
 * This watches for changes to the HTML element's class (from Storybook's toolbar)
 * and updates next-themes accordingly. It only syncs from Storybook -> next-themes,
 * not the reverse, to allow components to control their own theme.
 */
const ThemeSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const htmlElement = document.documentElement;

    // Set initial theme from HTML class
    if (isInitialMount.current) {
      const initialTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
      if (theme !== initialTheme) {
        setTheme(initialTheme);
      }
      isInitialMount.current = false;
    }

    // Watch for class changes from Storybook's toolbar
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = htmlElement.classList.contains('dark');
          const newTheme = isDark ? 'dark' : 'light';
          // Only update if different to avoid unnecessary re-renders
          if (theme !== newTheme) {
            setTheme(newTheme);
          }
        }
      });
    });

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [theme, setTheme]);

  return <>{children}</>;
};

const Wrapper: React.FC<WrapperProps> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSync>
        {children}
        <Toaster />
      </ThemeSync>
    </ThemeProvider>
  );
};

Wrapper.displayName = 'Wrapper';

export { Wrapper };
