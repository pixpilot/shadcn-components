import type { AlertToastProps } from './types';
import { cn } from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import React from 'react';
import { Alert } from '../Alert';

const AlertToast: React.FC<AlertToastProps> = (props) => {
  const { duration, onClose, ...rest } = props;

  return (
    <Alert
      icon
      {...rest}
      className={cn('shadow-md', props.className, { 'pr-3': onClose })}
    >
      {onClose && (
        <div className="flex items-start pt-0.5 pl-1">
          <button
            type="button"
            className="cursor-pointer opacity-80 transition-opacity hover:opacity-100"
            onClick={onClose}
          >
            <XIcon className="size-4.5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      )}
    </Alert>
  );
};

AlertToast.displayName = 'AlertToast';

export { AlertToast };
