import type { AlertVariant } from './variant-config';
import { AlertDescription, AlertTitle, Alert as ShadAlert } from '@pixpilot/shadcn';
import React from 'react';
import { cn } from '@/lib';
import { variantConfig } from './variant-config';

export type { AlertVariant };

export interface AlertBaseProps {
  variant?: AlertVariant;
  description?: React.ReactNode;
  duration?: number; // in milliseconds
  title?: string;
  className?: string;
  icon?: React.JSX.Element | boolean;
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, AlertBaseProps {}

function getIcon(icon?: React.JSX.Element | boolean, variant?: AlertVariant) {
  if (icon === false) {
    return null;
  }
  if (icon === undefined || icon === true) {
    const { IconComponent } = variantConfig[variant ?? 'default'];
    return <IconComponent className="t-0 size-4" />;
  }
  return icon;
}

const Alert: React.FC<AlertProps> = (props) => {
  const {
    description,
    variant = 'default',
    title,
    className,
    children,
    icon = false,
    ...rest
  } = props;

  const msgIcon = getIcon(icon, variant);

  const hasTitle = title != null && title.trim() !== '';
  const hasContent = hasTitle || description != null;

  const config = variantConfig[variant] ?? variantConfig.default;

  return (
    <ShadAlert
      {...rest}
      variant="destructive"
      className={cn(
        'bg-card border-accent! flex justify-between rounded-sm border-0 border-l-4',
        msgIcon ? 'flex-row' : 'flex-col',
        config.borderClass,
        config.textClass,
        className,
      )}
    >
      {/* {msgIcon} */}
      {msgIcon && <div className={cn('mr-3 flex items-start pt-0.5')}>{msgIcon}</div>}
      {hasContent && (
        <div className="flex flex-1 flex-col gap-1">
          {hasTitle && (
            <AlertTitle className={cn(config.textClass, { 'block!': !hasTitle })}>
              {title}
            </AlertTitle>
          )}
          {description != null && (
            <AlertDescription
              className={cn(
                config.descClass,
                !hasTitle && config.textClass,
                'whitespace-pre-wrap',
              )}
            >
              {description}
            </AlertDescription>
          )}
        </div>
      )}
      {children}
    </ShadAlert>
  );
};

Alert.displayName = 'Alert';

export { Alert };
