import type { AlertBaseProps, AlertVariant } from '@pixpilot/shadcn-ui';

import type { AlertToastProps } from './types';
import { simpleHash } from '@pixpilot/hash';
import { toast as sonnerToast } from 'sonner';
import { AlertToast } from './AlertToast';

export const DEFAULT_ALERT_DURATION = 10_000;

interface ToastProps extends AlertBaseProps {
  duration?: number;
  description?: string;
}

// Track toast instances with counter
const toastInstances = new Map<string, { currentId: string; counter: number }>();

export function toast(props: ToastProps) {
  const { duration, ...rest } = props;

  const baseId = `toast_${simpleHash(`${props.title ?? ''}::${props.description ?? ''}`)}`;

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
  const toastId = currentInstance.currentId;

  const cleanUp = (id: string | number) => {
    const latestInstance = toastInstances.get(baseId);
    if (latestInstance && latestInstance.currentId === id) {
      toastInstances.delete(baseId);
    }
  };

  sonnerToast.custom(
    (t) => <AlertToast {...rest} onClose={() => sonnerToast.dismiss(t)} />,
    {
      duration: duration ?? DEFAULT_ALERT_DURATION,
      id: toastId,

      onDismiss: (t) => {
        cleanUp(t.id);
      },
      onAutoClose(t) {
        cleanUp(t.id);
      },
    },
  );
}

export type ToastMessage =
  | string
  | ({ title: string; description: string } & AlertToastProps);

function createToast(variant: AlertVariant, message: ToastMessage, duration?: number) {
  if (typeof message === 'string') {
    toast({ variant, description: message, duration });
  } else {
    toast({ variant, ...message, duration });
  }
}

export function toastInfo(message: ToastMessage, duration?: number) {
  createToast('info', message, duration);
}

export function toastSuccess(message: ToastMessage, duration?: number) {
  createToast('success', message, duration);
}

export function toastWarning(message: ToastMessage, duration?: number) {
  createToast('warning', message, duration);
}

export function toastError(message: ToastMessage, duration?: number) {
  createToast('error', message, duration);
}
