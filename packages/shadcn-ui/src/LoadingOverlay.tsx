'use client';
import { cn } from '@pixpilot/shadcn';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DEFAULT_DELAY = 0;
const FADE_DURATION = 300;

export interface LoaderProps {
  backdrop?: boolean;
  placement?: 'top' | 'bottom' | 'center';
  loading: boolean;
  message?: string;
  delay?: number;
}

const LoadingOverlay: React.FC<LoaderProps> = (props) => {
  const {
    backdrop = true,
    placement = 'center',
    loading,
    delay = DEFAULT_DELAY,
    message,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (loading) {
      timeoutId = setTimeout(() => {
        setMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setVisible(true);
          });
        });
      }, delay);
    } else {
      setVisible(false);

      // Only delay unmounting if we're actually mounted
      timeoutId = setTimeout(
        () => {
          setMounted(false);
        },
        mounted ? FADE_DURATION : 0,
      );
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading, delay, mounted]); // Add 'mounted' to dependencies

  const positionClass = {
    top: 'items-start pt-[50px]',
    center: 'items-center',
    bottom: 'items-end pb-[50px]',
  }[placement];

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex justify-center transition-opacity',
        positionClass,
        backdrop ? 'bg-black/50' : 'pointer-events-none',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      style={{
        transitionDuration: `${FADE_DURATION}ms`,
      }}
    >
      <div className="flex flex-col items-center">
        <Loader2 className="text-foreground h-10 w-10 animate-spin" />
        {message != null && <div className="mt-2 text-foreground">{message}</div>}
      </div>
    </div>
  );
};

export { LoadingOverlay };
