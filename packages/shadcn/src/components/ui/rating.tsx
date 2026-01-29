import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/index';
import { Circle, Star } from 'lucide-react';

const ratingVariants = cva('inline-flex items-center gap-1', {
  variants: {
    size: {
      sm: '[&_svg]:size-4',
      default: '[&_svg]:size-5',
      lg: '[&_svg]:size-6',
      xl: '[&_svg]:size-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface RatingContextValue {
  value: number;
  hoverValue: number;
  max: number;
  readOnly: boolean;
  disabled: boolean;
  size: number;
  iconType: 'star' | 'circle';
  labels?: string[];
  onValueChange?: (value: number) => void;
  onHoverChange: (value: number) => void;
}

const RatingContext = React.createContext<RatingContextValue | undefined>(undefined);

function useRating() {
  const context = React.use(RatingContext);
  if (!context) {
    throw new Error('Rating components must be used within a Rating provider');
  }
  return context;
}

export interface RatingProps extends VariantProps<typeof ratingVariants> {
  /**
   * Current rating value for controlled mode
   */
  value?: number;
  /**
   * Initial rating value for uncontrolled mode
   * @default 0
   */
  defaultValue?: number;
  /**
   * Callback when rating value changes
   */
  onValueChange?: (value: number) => void;
  /**
   * Maximum rating value (number of items)
   * @default 5
   */
  max?: number;
  /**
   * Icon type to display
   * @default 'star'
   */
  iconType?: 'star' | 'circle';
  /**
   * Labels for each rating level (displayed on hover)
   */
  labels?: string[];
  /**
   * Disables interaction and shows display-only mode
   * @default false
   */
  readOnly?: boolean;
  /**
   * Disables all rating interactions
   * @default false
   */
  disabled?: boolean;
  /**
   * Form input name for form integration
   */
  name?: string;
  /**
   * Makes rating selection required for forms
   * @default false
   */
  required?: boolean;
  /**
   * Additional CSS classes for container
   */
  className?: string;
  /**
   * Children components (RatingButton)
   */
  children?: React.ReactNode;
}

/**
 * Rating component for displaying and collecting star/circle ratings
 */
function Rating({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  max = 5,
  iconType = 'star',
  labels,
  readOnly = false,
  disabled = false,
  name,
  required = false,
  size = 'default',
  className,
  children,
}: RatingProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState(0);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (newValue: number) => {
      if (readOnly || disabled) return;

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }

      onValueChange?.(newValue);
    },
    [readOnly, disabled, isControlled, onValueChange],
  );

  const handleHoverChange = React.useCallback(
    (newHoverValue: number) => {
      if (readOnly || disabled) return;
      setHoverValue(newHoverValue);
    },
    [readOnly, disabled],
  );

  const contextValue = React.useMemo<RatingContextValue>(
    () => ({
      value,
      hoverValue,
      max,
      readOnly,
      disabled,
      size: size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 32 : 20,
      iconType,
      labels,
      onValueChange: handleValueChange,
      onHoverChange: handleHoverChange,
    }),
    [
      value,
      hoverValue,
      max,
      readOnly,
      disabled,
      size,
      iconType,
      labels,
      handleValueChange,
      handleHoverChange,
    ],
  );

  return (
    <RatingContext.Provider value={contextValue}>
      <div
        className={cn(ratingVariants({ size }), className)}
        role="radiogroup"
        aria-label="Rating"
        aria-required={required}
        tabIndex={0}
        onMouseLeave={() => handleHoverChange(0)}
      >
        {children}
        {name && <input type="hidden" name={name} value={value} required={required} />}
      </div>
    </RatingContext.Provider>
  );
}

export interface RatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The rating value this button represents (1-based index)
   */
  index: number;
}

/**
 * Individual rating item button component
 */
function RatingButton({ index, className, ...props }: RatingButtonProps) {
  const {
    value,
    hoverValue,
    max,
    readOnly,
    disabled,
    size,
    iconType,
    labels,
    onValueChange,
    onHoverChange,
  } = useRating();

  const displayValue = hoverValue || value;
  const isFilled = index <= displayValue;
  const label = labels?.[index - 1];

  const Icon = iconType === 'circle' ? Circle : Star;

  const handleClick = () => {
    if (!readOnly && !disabled) {
      onValueChange?.(index);
    }
  };

  const handleMouseEnter = () => {
    if (!readOnly && !disabled) {
      onHoverChange(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly || disabled) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        onHoverChange(Math.min(index + 1, max));
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        onHoverChange(Math.max(index - 1, 1));
        break;
      case 'Home':
        e.preventDefault();
        onHoverChange(1);
        break;
      case 'End':
        e.preventDefault();
        onHoverChange(max);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleClick();
        break;
    }
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={index === value}
      aria-label={label || `Rate ${index}`}
      title={label}
      disabled={disabled || readOnly}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center justify-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
        readOnly && 'cursor-default',
        !readOnly && !disabled && 'cursor-pointer hover:scale-110',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          'transition-all',
          isFilled
            ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500'
            : 'fill-transparent text-muted-foreground',
        )}
        size={size}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}

export { Rating, RatingButton, useRating };
