import type { AlertToastProps } from './types';
import { cn } from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import React from 'react';
import { Alert } from '../alert';
import { variantConfig } from '../variant-config';

const AlertToast: React.FC<AlertToastProps> = (props) => {
  const {
    children,
    className,
    description,
    duration,
    icon = true,
    id,
    onClose,
    title,
    variant = 'default',
    ...rest
  } = props;

  const config = variantConfig[variant] ?? variantConfig.default;
  const hasTitle = title != null && title.trim() !== '';

  const closeButton = onClose && (
    <div className="flex shrink-0 items-start pt-0.5 ">
      <button
        id={id}
        type="button"
        className="cursor-pointer opacity-80 transition-opacity hover:opacity-100"
        onClick={onClose}
      >
        <XIcon className="size-4.5" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );

  if (onClose) {
    return (
      <Alert
        icon={icon}
        {...rest}
        variant={variant}
        className={cn('shadow-md pr-3', className)}
        description={
          <div className="flex w-full min-w-0 items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {hasTitle && (
                <div
                  data-slot="toast-title"
                  className={cn(
                    'line-clamp-1 min-h-4 font-medium tracking-tight',
                    config.textClass,
                  )}
                >
                  {title}
                </div>
              )}
              {description != null && (
                <div
                  data-slot="toast-description"
                  className={cn(
                    config.descClass,
                    !hasTitle && config.textClass,
                    'whitespace-pre-wrap',
                  )}
                >
                  {description}
                </div>
              )}
              {children}
            </div>
            {closeButton}
          </div>
        }
      />
    );
  }

  return (
    <Alert
      icon={icon}
      {...rest}
      variant={variant}
      title={title}
      description={description}
      className={cn('shadow-md', className)}
    >
      {children}
    </Alert>
  );
};

AlertToast.displayName = 'AlertToast';

export { AlertToast };
