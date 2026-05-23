import { ThemeProvider } from '../../../packages/shadcn-ui/src/theme-provider/ThemeProvider';
import { Toaster } from '../../../packages/shadcn-ui/src/toast/ToastProvider';

export interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
};

Wrapper.displayName = 'Wrapper';

export { Wrapper };
