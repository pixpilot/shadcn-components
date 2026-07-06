import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  cn,
  CardHeader as OrgCardHeader,
  CardTitle as OrgCardTitle,
} from '@pixpilot/shadcn';
import React from 'react';

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<typeof OrgCardTitle>) {
  return (
    <OrgCardTitle
      className={cn('text-lg font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<typeof OrgCardHeader>) {
  return <OrgCardHeader className={cn('gap-1.5', className)} {...props} />;
}

export { Card, CardAction, CardContent, CardDescription, CardFooter };
