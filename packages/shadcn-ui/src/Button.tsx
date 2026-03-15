import type {
  buttonVariants,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@pixpilot/shadcn';

import type { VariantProps } from 'class-variance-authority';
import { cn, Button as OrgButton } from '@pixpilot/shadcn';

import React, { useCallback } from 'react';
import { AbsoluteFill } from './AbsoluteFill';

export interface ButtonProps
  extends React.ComponentProps<typeof OrgButton>, VariantProps<typeof buttonVariants> {
  /**
   * Click handler for when disabled button is clicked
   */
  onDisabledClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Props to pass to the tooltip component
   */
  /**
   * Slots to customize tooltip components and their props.
   */
  slots?: {
    tooltip?: Omit<React.ComponentProps<typeof Tooltip>, 'children' | 'delayDuration'>;
    tooltipTrigger?: Omit<React.ComponentProps<typeof TooltipTrigger>, 'children'>;
    tooltipContent?: React.ComponentProps<typeof TooltipContent>;
    /** Props applied to the loader container element */
    loaderContainer?: React.HTMLAttributes<HTMLDivElement>;
    /** Custom loader node to render instead of the default `Loader2` */
    loader?: React.ReactNode;
  };
}

function Button(props: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const {
    children,
    disabled,
    onClick,
    onDisabledClick,
    title,
    slots,
    className,
    variant,
    size,
    ref,
    ...rest
  } = props;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick && !disabled) {
        onClick(e);
      }
    },
    [disabled, onClick],
  );

  const buttonContent = (
    <OrgButton
      {...rest}
      ref={ref}
      disabled={disabled}
      onClick={handleClick}
      className={cn('relative', className)}
      variant={variant}
      size={size}
      title={title}
    >
      {/* Disabled tooltip overlay - enables tooltip on disabled button */}
      {Boolean(disabled) && (
        <AbsoluteFill
          title={title}
          onClick={onDisabledClick}
          style={{ pointerEvents: 'all', cursor: 'not-allowed' }}
        />
      )}

      {children}
    </OrgButton>
  );

  return buttonContent;
}

Button.displayName = 'Button';

export { Button };
