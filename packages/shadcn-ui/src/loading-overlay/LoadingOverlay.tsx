/* eslint-disable ts/strict-boolean-expressions */
'use client';
import { cn } from '@pixpilot/shadcn';
import { Loader2 } from 'lucide-react';
import React, { useLayoutEffect, useRef } from 'react';
import { useDelayedVisibility } from '../hooks';

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
  show: boolean;
  /**
   * Optional loading message to display below spinner
   */
  message?: string | React.ReactNode;
  /**
   * Delay in milliseconds before showing the loader
   * @default 0
   */
  inDelay?: number;
  /**
   * Delay in milliseconds before hiding the loader after loading becomes false
   * @default 0
   */
  outDelay?: number;
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
    show,
    inDelay = DEFAULT_DELAY,
    outDelay = DEFAULT_DELAY,
    message,
    scope = 'container',
    size = 'default',
    className,
    slots,
  } = props;

  const contentProps = slots?.content || {};
  const overlayRef = useRef<HTMLDivElement>(null);
  const { mounted, visible } = useDelayedVisibility({
    show,
    inDelay,
    outDelay,
    fadeDuration: FADE_DURATION,
  });

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

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const container =
      mounted && scope === 'container' ? overlay?.parentElement : undefined;
    if (!overlay || !container) return () => {};

    let rafId: number;

    const updateTransform = () => {
      overlay.style.transform = `translate(${container.scrollLeft}px, ${container.scrollTop}px)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateTransform);
    };

    updateTransform(); // set initial position
    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', onScroll);
    };
  }, [mounted, scope]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      data-slot="loading-overlay"
      className={cn(
        'inset-0 z-[9999] flex justify-center transition-opacity',
        scope === 'container' ? 'absolute' : 'fixed',
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
      aria-busy={show}
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
