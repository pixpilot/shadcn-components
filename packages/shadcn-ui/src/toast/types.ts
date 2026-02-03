import type { AlertProps } from '../Alert';

export interface AlertToastProps extends AlertProps {
  onClose?: () => void;
  description?: string;
}
