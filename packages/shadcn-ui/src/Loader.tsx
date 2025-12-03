'use client';
import { cn } from '@pixpilot/shadcn';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useReducer } from 'react';

const DEFAULT_DELAY = 0;

export interface LoaderProps {
  backdrop?: boolean;
  /**
   * Position of the loader
   * @default 'center'
   */
  placement?: 'top' | 'bottom' | 'center';
  loading: boolean;
  message?: string;
  /**
   * Delay in milliseconds before showing the loader
   * @default 300
   */
  delay?: number;
}

const Loader: React.FC<LoaderProps> = (props) => {
  const { backdrop = true, placement = 'center', loading, delay = DEFAULT_DELAY } = props;
  const [show, dispatch] = useReducer(
    (state: boolean, action: { type: 'show' | 'hide' }) => {
      switch (action.type) {
        case 'show':
          return true;
        case 'hide':
          return false;
        default:
          return state;
      }
    },
    false,
  );

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => dispatch({ type: 'show' }), delay);
      return () => clearTimeout(timer);
    }
    dispatch({ type: 'hide' });
    return undefined;
  }, [loading, delay]);

  const positionClass = {
    top: 'items-start pt-[50px]',
    center: 'items-center',
    bottom: 'items-end  pb-[50px]',
  }[placement];

  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-9999 flex justify-center',
        positionClass,
        backdrop && 'bg-black/50',
      )}
    >
      <Loader2 className="text-foreground h-10 w-10 animate-spin" />
    </div>
  );
};

export { Loader };
