import type { buttonVariants } from '@pixpilot/shadcn';

import type { VariantProps } from 'class-variance-authority';
import {
  cn,
  Button as OrgButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@pixpilot/shadcn';

import { Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';
import { AbsoluteFill } from './AbsoluteFill';

export interface ButtonLoaderProps {
  /**
   * Position of the loader relative to button content
   * @default 'end'
   */
  placement?: 'start' | 'end' | 'center';
}

export interface ButtonProps
  extends React.ComponentProps<typeof OrgButton>, VariantProps<typeof buttonVariants> {
  /**
   * Tooltip message to show when button is disabled
   */
  disabledTooltip?: string;
  /**
   * Regular tooltip message
   */
  tooltip?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Loader configuration
   */
  LoaderProps?: ButtonLoaderProps;
  /**
   * Click handler for when disabled button is clicked
   */
  onDisabledClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Props to pass to the tooltip component
   */
  TooltipProps?: Omit<React.ComponentProps<typeof Tooltip>, 'children' | 'delayDuration'>;
}

const LOADER_SIZE_SM = 14;
const LOADER_SIZE_DEFAULT = 16;
const LOADER_SIZE_LG = 20;

/**
 * Get loader size based on button size
 */
function getLoaderSize(
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg' | null,
): number {
  if (size === 'sm' || size === 'icon-sm') {
    return LOADER_SIZE_SM;
  }
  if (size === 'lg' || size === 'icon-lg') {
    return LOADER_SIZE_LG;
  }
  return LOADER_SIZE_DEFAULT;
}

function Button(props: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const {
    children,
    disabled,
    onClick,
    disabledTooltip,
    loading,
    LoaderProps,
    onDisabledClick,
    tooltip,
    title,
    TooltipProps,
    className,
    variant,
    size,
    ref,
    ...rest
  } = props;

  const { placement: loaderPlacement = 'end' } = LoaderProps || {};

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick && !disabled) {
        onClick(e);
      }
    },
    [disabled, onClick],
  );

  const isDisabled = disabled || loading;
  const hasTooltip = Boolean(tooltip) || Boolean(title);
  const hasDisabledTooltip = Boolean(disabledTooltip) && isDisabled;
  const showTooltip = hasTooltip || hasDisabledTooltip;
  const tooltipContent = hasDisabledTooltip
    ? (disabledTooltip ?? '')
    : (tooltip ?? title ?? '');

  const Loader = (
    <div
      className={cn(
        'flex items-center justify-center',
        loaderPlacement === 'center' && 'rounded-0 absolute inset-0',
        loaderPlacement === 'start' && 'mr-1',
        loaderPlacement === 'end' && 'ml-1',
      )}
    >
      <Loader2
        className="text-background animate-spin"
        style={{ height: getLoaderSize(size), width: getLoaderSize(size) }}
      />
    </div>
  );

  const buttonContent = (
    <OrgButton
      {...rest}
      ref={ref}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn('relative', className)}
      variant={variant}
      size={size}
    >
      {/* Disabled tooltip overlay - enables tooltip on disabled button */}
      {Boolean(disabledTooltip) && isDisabled && (
        <Tooltip {...TooltipProps}>
          <TooltipTrigger asChild>
            <AbsoluteFill
              onClick={onDisabledClick}
              style={{ pointerEvents: 'all', cursor: 'not-allowed' }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabledTooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {loading && loaderPlacement === 'start' && Loader}

      {children}
      {loading && (loaderPlacement === 'end' || loaderPlacement === 'center') && Loader}
    </OrgButton>
  );

  // If there's a tooltip and button is not disabled (or no disabled tooltip), wrap with tooltip
  if (showTooltip && !(Boolean(disabledTooltip) && isDisabled)) {
    return (
      <Tooltip {...TooltipProps}>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
}

Button.displayName = 'Button';

export { Button };
