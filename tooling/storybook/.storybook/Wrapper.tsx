import { ThemeProvider } from '@pixpilot/shadcn-ui';
import React from 'react';

export interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = (props) => {
  const { children } = props;

  return <ThemeProvider>{children}</ThemeProvider>;
};

Wrapper.displayName = 'Wrapper';

export { Wrapper };
