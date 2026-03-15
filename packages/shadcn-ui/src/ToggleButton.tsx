'use client';

import type { buttonVariants } from '@pixpilot/shadcn';
import type { VariantProps } from 'class-variance-authority';
import { Button } from '@pixpilot/shadcn';
import React, { useCallback } from 'react';

type ButtonBaseProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export interface ToggleButtonProps extends Omit<ButtonBaseProps, 'onChange'> {
  /**
   * Controlled checked state
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;

  /**
   * Fired when state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Content rendered when checked
   */
  checkedContent?: React.ReactNode;

  /**
   * Content rendered when unchecked
   */
  uncheckedContent?: React.ReactNode;

  /**
   * Props to apply when checked
   */
  checkedProps?: Partial<ButtonBaseProps>;

  /**
   * Props to apply when unchecked
   */
  uncheckedProps?: Partial<ButtonBaseProps>;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      checkedContent,
      uncheckedContent,
      checkedProps,
      uncheckedProps,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);

    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;

        const next = !checked;

        if (!isControlled) {
          setUncontrolledChecked(next);
        }

        onChange?.(next);
        props.onClick?.(e);
      },
      [checked, disabled, isControlled, onChange, props],
    );

    return (
      <Button
        variant="outline"
        type="button"
        data-slot="toggle-button"
        {...props}
        {...(checked ? checkedProps : uncheckedProps)}
        aria-pressed={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        ref={ref}
        onClick={handleClick}
      >
        {checked ? checkedContent : uncheckedContent}
      </Button>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
