import type { ComponentSize } from './types';
import { Pencil } from 'lucide-react';

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
}> = ({ children, className, iconClass, showChangeIcon }) => {
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
