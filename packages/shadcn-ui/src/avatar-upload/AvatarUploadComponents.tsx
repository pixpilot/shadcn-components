import type { ComponentSize, ComponentSizes } from './types';
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
  showChangeIcon: boolean;
  size: keyof ComponentSizes;
  onClear?: () => void;
}> = ({ children, className, showChangeIcon, size, onClear }) => {
  const editIcon: Record<keyof ComponentSizes, string> = {
    sm: 'size-5.5 bottom-0 right-0',
    md: 'size-6.5 bottom-1 right-1',
    lg: 'size-7 bottom-1.5 right-1.5',
  };

  const clearButtonSize: Record<keyof ComponentSizes, string> = {
    sm: 'size-5.5',
    md: 'size-6.5',
    lg: 'size-7.5',
  };

  const rootSize: Record<keyof ComponentSizes, string> = {
    sm: 'h-20 w-20',
    md: 'h-28 w-28',
    lg: 'h-40 w-40',
  };

  return (
    <div className={cn('relative', rootSize[size], className)}>
      {children}
      {showChangeIcon && (
        <Pencil
          className={cn(
            editIcon[size],
            `absolute bg-secondary text-secondary-foreground rounded-full p-1.5 shadow-md`,
          )}
        />
      )}
      {onClear != null && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className={cn(
            '-top-2.5 -right-2.5 absolute  rounded-full ',
            clearButtonSize[size],
          )}
          aria-label="Clear avatar"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClear();
          }}
        >
          <X className={cn('p-1.5', clearButtonSize[size])} />
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
