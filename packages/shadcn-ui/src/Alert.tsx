import { AlertDescription, AlertTitle, Alert as ShadAlert } from '@pixpilot/shadcn';
import { CircleAlertIcon, CircleCheckBigIcon, OctagonAlertIcon } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib';

const iconClass = cn('t-0 size-4');

export type AlertVariant = 'error' | 'info' | 'warning' | 'success' | 'default';

export interface AlertBaseProps {
  variant?: AlertVariant;
  description?: string;
  duration?: number; // in milliseconds
  title?: string;
  className?: string;
  icon?: React.JSX.Element | boolean;
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, AlertBaseProps {}

const colors: {
  [key in AlertVariant]: {
    class: string;
    icon: React.JSX.Element;
    textClass: string;
    descClass: string;
  };
} = {
  error: {
    descClass: 'text-destructive',
    textClass: 'text-destructive',
    class: cn('border-current/80!'),
    icon: <OctagonAlertIcon className={iconClass} />,
  },
  warning: {
    descClass: 'text-amber-600/80 dark:text-amber-400/80',
    textClass: 'text-amber-600 dark:border-amber-400 dark:text-amber-400',
    class: cn('border-current/80!'),
    icon: <CircleAlertIcon className={iconClass} />,
  },
  info: {
    descClass: 'text-sky-600/80 dark:text-sky-400/80',
    textClass: 'text-sky-600 dark:border-sky-400 dark:text-sky-400',
    class: cn('border-current/80!'),
    icon: <CircleAlertIcon className={iconClass} />,
  },
  success: {
    descClass: 'text-green-600/80 dark:text-green-400/80',
    textClass: 'text-green-600 dark:border-green-400 dark:text-green-400',
    class: cn('border-current/80!'),
    icon: <CircleCheckBigIcon className={iconClass} />,
  },
  default: {
    descClass: 'text-foreground/80',
    textClass: 'text-foreground',
    class: cn('border-current/60!'),
    icon: <CircleAlertIcon className={iconClass} />,
  },
};

function getIcon(icon?: React.JSX.Element | boolean, variant?: AlertVariant) {
  if (icon === false) {
    return null;
  }
  if (icon === undefined || icon === true) {
    return colors[variant ?? 'default'].icon;
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

  const variantConfig = colors[variant] ?? colors.default;

  return (
    <ShadAlert
      {...rest}
      variant="destructive"
      className={cn(
        'bg-card border-accent! flex justify-between rounded-sm border-0 border-l-4',
        variantConfig.class,
        variantConfig.textClass,
        className,
      )}
    >
      {/* {msgIcon} */}
      {msgIcon && <div className={cn('mr-3 flex items-start pt-0.5')}>{msgIcon}</div>}
      <div className="flex flex-1 flex-col gap-1">
        {hasTitle && (
          <AlertTitle className={cn(variantConfig.textClass, { 'block!': !hasTitle })}>
            {title}
          </AlertTitle>
        )}
        {description != null && (
          <AlertDescription
            className={cn(variantConfig.descClass, !hasTitle && variantConfig.textClass)}
          >
            {description}
          </AlertDescription>
        )}
      </div>
      {children}
    </ShadAlert>
  );
};

Alert.displayName = 'Alert';

export { Alert };
