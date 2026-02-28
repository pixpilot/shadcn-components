/* eslint-disable ts/strict-boolean-expressions */
'use client';
import { cn } from '@pixpilot/shadcn';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DEFAULT_DELAY = 0;
const FADE_DURATION = 300;

export interface LoadingOverlayProps {
  /**
   * Show semi-transparent backdrop
   * @default true
   */
  backdrop?: boolean;
  /**
   * Vertical alignment of the loader
   * @default 'center'
   */
  placement?: 'top' | 'bottom' | 'center';
  /**
   * Whether to show the loader
   */
  loading: boolean;
  /**
   * Optional loading message to display below spinner
   */
  message?: string;
  /**
   * Delay in milliseconds before showing the loader
   * @default 0
   */
  delay?: number;
  /**
   * Scope of the loader overlay
   * - 'container': Fills parent container (requires parent with position: relative)
   * - 'fullscreen': Covers entire viewport
   * @default 'container'
   */
  scope?: 'container' | 'fullscreen';
  /**
   * Size of the spinner
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * Custom class name for the overlay wrapper
   */
  className?: string;
  /**
   * Slots for customizing inner elements' props (e.g. spinner/message)
   */
  slots?: {
    /** Props forwarded to the spinner (`Loader2`) component */
    spinner?: React.ComponentProps<typeof Loader2>;
    /** Props forwarded to the message `div` element */
    message?: React.HTMLAttributes<HTMLDivElement>;
    /** Props forwarded to the inner content `div` (flex column wrapper) */
    content?: React.HTMLAttributes<HTMLDivElement>;
  };
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = (props) => {
  const {
    backdrop = true,
    placement = 'center',
    loading,
    delay = DEFAULT_DELAY,
    message,
    scope = 'container ',
    size = 'default',
    className,
    slots,
  } = props;

  const contentProps = slots?.content || {};

  const hasDelay = delay > 0;

  // When loading starts as true with no delay, mount and show immediately
  // to block content without any fade-in animation.
  const [mounted, setMounted] = useState(() => !hasDelay && loading);
  const [visible, setVisible] = useState(() => !hasDelay && loading);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (loading) {
      /*
       * Always mount via setTimeout + double-RAF so that subsequent
       * loading=true toggles get a fade-in transition.
       * When delay=0 and loading is true on the very first render,
       * the lazy useState initializer already set mounted/visible=true,
       * so these setters are no-ops and no flicker occurs.
       */
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
  }, [loading, delay, mounted]);

  const positionClass = {
    top: 'items-start pt-[50px]',
    center: 'items-center',
    bottom: 'items-end pb-[50px]',
  }[placement];

  const sizeClass = {
    sm: 'h-6 w-6',
    default: 'h-10 w-10',
    lg: 'h-16 w-16',
  }[size];

  const messageSizeClass = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  }[size];

  if (!mounted) {
    return null;
  }

  return (
    <div
      data-slot="loading-overlay"
      className={cn(
        'inset-0 z-[9999] flex justify-center transition-opacity',
        scope === 'fullscreen' ? 'fixed' : 'absolute',
        positionClass,
        backdrop ? 'bg-black/50' : 'pointer-events-none',
        visible ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{
        transitionDuration: `${FADE_DURATION}ms`,
      }}
      role="status"
      aria-live="polite"
      aria-busy={loading}
    >
      <div
        data-slot="loading-overlay-content"
        {...contentProps}
        className={cn('flex flex-col items-center gap-2', contentProps.className)}
      >
        <Loader2
          data-slot="loading-overlay-spinner"
          className={cn(
            'text-foreground animate-spin',
            sizeClass,
            slots?.spinner?.className,
          )}
          aria-hidden="true"
        />
        {message != null && (
          <div
            data-slot="loading-overlay-message"
            className={cn(
              'text-foreground font-medium',
              messageSizeClass,
              slots?.message?.className,
            )}
          >
            {message}
          </div>
        )}
        {/* Screen reader only text */}
        <span className="sr-only">{message || 'Loading, please wait...'}</span>
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

export { LoadingOverlay };
