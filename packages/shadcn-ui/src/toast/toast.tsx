import type { AlertBaseProps, AlertVariant } from '@pixpilot/shadcn-ui';

import type { ToastT } from 'sonner';
import type { AlertToastProps } from './types';
import { simpleHash } from '@pixpilot/hash';
import { toast as sonnerToast } from 'sonner';
import { AlertToast } from './AlertToast';

export const DEFAULT_ALERT_DURATION = 10_000;

interface ToastOwnProps extends Pick<ToastT, 'dismissible' | 'duration' | 'position'> {
  id?: string;
}

interface ToastProps extends AlertBaseProps, ToastOwnProps {
  description?: string;
}

export type ToastMessage =
  | string
  | ({ title: string; description: string } & AlertToastProps);

export interface ToastFunction {
  (props: ToastProps): void;
  error: (message: ToastMessage, options?: ToastOwnProps) => void;
  success: (message: ToastMessage, options?: ToastOwnProps) => void;
  warning: (message: ToastMessage, options?: ToastOwnProps) => void;
  info: (message: ToastMessage, options?: ToastOwnProps) => void;
  custom: (component: React.ReactElement, options?: ToastOwnProps) => void;
  remove: (id: string) => void;
  removeAll: () => void;
}

// Track toast instances with counter
const toastInstances = new Map<string, { currentId: string; counter: number }>();

function getToastId(baseId: string) {
  // Get or initialize the instance tracker
  const instance = toastInstances.get(baseId);

  if (instance) {
    // Dismiss the previous instance
    sonnerToast.dismiss(instance.currentId);

    // Increment counter and create new ID
    instance.counter += 1;
    instance.currentId = `${baseId}_${instance.counter}`;
  } else {
    // First time showing this toast
    toastInstances.set(baseId, {
      currentId: `${baseId}_0`,
      counter: 0,
    });
  }

  const currentInstance = toastInstances.get(baseId)!;
  return currentInstance.currentId;
}

function getToastHandlers(baseId: string) {
  const cleanUp = (tId: string | number) => {
    const latestInstance = toastInstances.get(baseId);
    if (latestInstance && latestInstance.currentId === tId) {
      toastInstances.delete(baseId);
    }
  };

  return {
    onDismiss: (t: ToastT) => {
      cleanUp(t.id);
    },
    onAutoClose: (t: ToastT) => {
      cleanUp(t.id);
    },
  };
}

const toast: ToastFunction = function (props: ToastProps) {
  const { duration, id, dismissible = true, position, ...rest } = props;

  const baseId =
    id ?? `toast_${simpleHash(`${props.title ?? ''}::${props.description ?? ''}`)}`;

  const toastId = getToastId(baseId);
  const handlers = getToastHandlers(baseId);

  sonnerToast.custom(
    (t) => (
      <AlertToast
        {...rest}
        onClose={dismissible ? () => sonnerToast.dismiss(t) : undefined}
      />
    ),
    {
      duration: duration ?? DEFAULT_ALERT_DURATION,
      id: toastId,
      position,
      ...handlers,
    },
  );
};

function createToast(
  variant: AlertVariant,
  message: ToastMessage,
  options?: ToastOwnProps,
) {
  if (typeof message === 'string') {
    toast({ ...options, variant, description: message });
  } else {
    toast({ ...options, ...message });
  }
}

toast.error = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('error', message, options);
toast.success = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('success', message, options);
toast.warning = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('warning', message, options);
toast.info = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('info', message, options);

toast.custom = (component: React.ReactElement, options?: ToastOwnProps) => {
  const { duration, ...rest } = options || {};

  // 1. No tracking Map!
  // 2. No ID generation! (Sonner does this natively if `id` is missing)
  // 3. No counter suffixes!

  sonnerToast.custom(() => component, {
    duration: duration ?? DEFAULT_ALERT_DURATION,
    ...rest, // This passes 'id', 'position', etc., straight to Sonner
  });
};
toast.remove = (id: string) => {
  sonnerToast.dismiss(id);
};

toast.removeAll = () => {
  sonnerToast.dismiss();
  toastInstances.clear();
};

export { toast };
