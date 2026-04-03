import type { ComponentSize } from './types';
import { Button } from '@pixpilot/shadcn';
import { Pencil, X } from 'lucide-react';

import React from 'react';
import { cn } from '@/lib';

export const MessageComponent: React.FC<{ message: string; className?: string }> = ({
  message,
  className,
}) => {
  return <p className={cn('text-sm text-muted-foreground', className)}>{message}</p>;
};

export const AvatarWrap: React.FC<{
  children: React.ReactNode;
  className?: string;
  iconClass: string;
  showChangeIcon: boolean;
  onClear?: () => void;
}> = ({ children, className, iconClass, showChangeIcon, onClear }) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {showChangeIcon && (
        <Pencil
          className={cn(
            `absolute bottom-0 right-0 bg-secondary text-secondary-foreground rounded-full p-1.5 shadow-md`,
            iconClass,
          )}
        />
      )}
      {onClear != null && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="-top-2.5 -right-2.5 absolute size-5.5 rounded-full"
          aria-label="Clear avatar"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClear();
          }}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  );
};

export const Image: React.FC<{ src: string; className?: string }> = ({
  src,
  className,
}) => {
  return (
    <img
      src={src}
      alt="Avatar preview"
      className={cn('rounded-full object-cover w-full h-full', className)}
    />
  );
};

export const MainWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  currentSize: ComponentSize;
}> = ({ children, className, currentSize }) => {
  return (
    <div
      className={cn('flex flex-col items-center relative', className, currentSize.main)}
    >
      {children}
    </div>
  );
};
