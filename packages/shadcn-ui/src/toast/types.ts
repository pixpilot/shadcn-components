import type { AlertProps } from '../alert';

export interface AlertToastProps extends AlertProps {
  onClose?: () => void;
  description?: string;
}
