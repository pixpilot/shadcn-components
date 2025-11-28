import { ThemeProvider } from '@pixpilot/shadcn-ui';
import { useTheme } from 'next-themes';

import React, { useEffect, useRef } from 'react';

export interface WrapperProps {
  children: React.ReactNode;
}

/**
 * Inner component that syncs Storybook's theme changes with next-themes.
 *
 * This is necessary because Storybook's withThemeByClassName decorator
 * directly manipulates the HTML element's class, but next-themes needs
 * to be notified of these changes to properly sync the color-scheme style.
 */
const ThemeSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setTheme } = useTheme();
  const setThemeRef = useRef(setTheme);

  // Keep the ref updated
  useEffect(() => {
    setThemeRef.current = setTheme;
  }, [setTheme]);

  useEffect(() => {
    // Get the initial theme from the html element class
    const htmlElement = document.documentElement;
    const initialTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
    setThemeRef.current(initialTheme);

    // Watch for class changes on the html element (from Storybook's withThemeByClassName)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = htmlElement.classList.contains('dark');
          const newTheme = isDark ? 'dark' : 'light';
          setThemeRef.current(newTheme);
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
  }, []); // Empty dependency array - only run once

  return <>{children}</>;
};

const Wrapper: React.FC<WrapperProps> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <ThemeSync>{children}</ThemeSync>
    </ThemeProvider>
  );
};

Wrapper.displayName = 'Wrapper';

export { Wrapper };
