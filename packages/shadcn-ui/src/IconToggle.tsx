import { cn } from '@pixpilot/shadcn';
import React, { useCallback } from 'react';
import { isSvgMarkupString, svgMarkupToMaskUrl } from './utils';

export interface IconToggleProps extends Omit<
  React.ComponentProps<'button'>,
  'onChange'
> {
  /**
   * The checked/toggled state
   */
  checked?: boolean;
  /**
   * Default checked state for uncontrolled usage
   */
  defaultChecked?: boolean;
  /**
   * Called when the toggle state changes (controlled)
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Called when the toggle state changes (alternative handler)
   */
  onChange?: (checked: boolean) => void;
  /**
   * Icon to show when checked (true state)
   * Can be a React component (like lucide-react icons) or SVG markup string
   */
  checkedIcon?: React.ReactNode | string;
  /**
   * Icon to show when unchecked (false state)
   * Can be a React component (like lucide-react icons) or SVG markup string
   */
  uncheckedIcon?: React.ReactNode | string;
  /**
   * Size variant of the toggle button
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * Visual variant of the toggle button
   * @default 'default'
   */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * IconToggle - A toggle button component with customizable icons for checked/unchecked states.
 * Perfect for visibility toggles, theme switches, or any boolean state with visual feedback.
 * Icons can be React components (like lucide-react icons) or SVG markup strings.
 */
export const IconToggle = React.forwardRef<HTMLButtonElement, IconToggleProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      onChange,
      checkedIcon,
      uncheckedIcon,
      size = 'default',
      variant = 'default',
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);

    // Determine if component is controlled
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;

        const newChecked = !checked;

        if (!isControlled) {
          setUncontrolledChecked(newChecked);
        }

        // Call all handlers
        onCheckedChange?.(newChecked);
        onChange?.(newChecked);
        props.onClick?.(e);
      },
      [checked, disabled, isControlled, onChange, onCheckedChange, props],
    );

    const renderIcon = (icon: React.ReactNode | string | undefined): React.ReactNode => {
      if (icon === undefined || icon === null) return null;

      // If icon is an SVG markup string, render as masked icon
      if (isSvgMarkupString(icon)) {
        return (
          <span
            data-slot="svg-mask"
            aria-hidden="true"
            className="inline-block size-[1.2em]"
            style={{
              backgroundColor: 'currentColor',
              WebkitMaskImage: svgMarkupToMaskUrl(icon),
              maskImage: svgMarkupToMaskUrl(icon),
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
        );
      }

      // Otherwise render as React node
      return icon;
    };

    const sizeClasses = {
      sm: 'size-7',
      default: 'size-9',
      lg: 'size-11',
    };

    const variantClasses = {
      default:
        'bg-background border border-input hover:bg-accent hover:text-accent-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:hover:bg-primary/90',
      outline:
        'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary data-[state=checked]:text-primary',
      ghost:
        'hover:bg-accent hover:text-accent-foreground data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary',
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        data-slot="icon-toggle"
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
          '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-[1.2em] [&_svg]:shrink-0',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {checked ? renderIcon(checkedIcon) : renderIcon(uncheckedIcon)}
      </button>
    );
  },
);

IconToggle.displayName = 'IconToggle';
