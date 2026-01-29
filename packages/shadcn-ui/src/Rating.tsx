import type { VariantProps } from 'class-variance-authority';
import { cn } from '@pixpilot/shadcn';
import { cva } from 'class-variance-authority';
import { Circle, Star } from 'lucide-react';
import * as React from 'react';

export type RatingColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'foreground'
  | 'accent'
  | 'muted'
  | 'ring';

export interface RatingOption {
  label: string;
  value: number;
}

const DEFAULT_MAX_RATING = 5;

const ratingVariants = cva('inline-flex items-center gap-1', {
  variants: {
    size: {
      sm: '[&_svg]:size-4',
      default: '[&_svg]:size-5',
      lg: '[&_svg]:size-6',
      xl: '[&_svg]:size-7',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type RatingSize = VariantProps<typeof ratingVariants>['size'];

const sizePixels: Record<NonNullable<RatingSize>, number> = {
  sm: 16,
  default: 20,
  lg: 24,
  xl: 28,
};

const colorClasses: Record<RatingColor, string> = {
  default:
    '[&_svg]:!fill-yellow-400 [&_svg]:!text-yellow-400 dark:[&_svg]:!fill-yellow-500 dark:[&_svg]:!text-yellow-500 [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground/30',
  primary:
    '[&_svg]:!fill-primary [&_svg]:!text-primary [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground/30',
  secondary:
    '[&_svg]:!fill-secondary [&_svg]:!text-secondary-foreground [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground/30',
  destructive:
    '[&_svg]:!fill-destructive [&_svg]:!text-destructive [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground/30',
  foreground:
    '[&_svg]:!fill-foreground [&_svg]:!text-foreground [&_svg.fill-transparent]:!fill-transparent',
  accent:
    '[&_svg]:!fill-accent [&_svg]:!text-accent-foreground [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground/30',
  muted:
    '[&_svg]:!fill-muted [&_svg]:!text-muted-foreground [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground/30',
  ring: '[&_svg]:!fill-ring [&_svg]:!text-ring [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground/30',
};

type IconType = 'star' | 'circle';

interface RatingContextValue {
  value: number;
  hoverIndex: number;
  selectedIndex: number;
  options: RatingOption[];
  max: number;
  readOnly: boolean;
  disabled: boolean;
  size: number;
  iconType: IconType;
  colorClassName: string;
  setHoverIndex: (value: number) => void;
  setValueByIndex: (index: number) => void;
}

const RatingContext = React.createContext<RatingContextValue | null>(null);

function useRating(): RatingContextValue {
  const context = React.use(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a Rating component');
  }
  return context;
}

function buildFallbackOptions(max: number): RatingOption[] {
  return Array.from({ length: max }, (_, index) => {
    const value = index + 1;
    return {
      value,
      label: `Rate ${value}`,
    };
  });
}

function getIndexForValue(value: number, options: RatingOption[]): number {
  if (!value) return 0;
  const foundIndex = options.findIndex((option) => option.value === value);
  return foundIndex === -1 ? 0 : foundIndex + 1;
}

export interface RatingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue'
> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;

  max?: number;
  options?: RatingOption[];
  iconType?: IconType;
  size?: RatingSize;

  readOnly?: boolean;
  disabled?: boolean;

  name?: string;
  required?: boolean;

  color?: RatingColor;
}

export interface RatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
}

function RatingButton({ index, className, ...props }: RatingButtonProps) {
  const {
    selectedIndex,
    hoverIndex,
    setHoverIndex,
    setValueByIndex,
    max,
    readOnly,
    disabled,
    size,
    iconType,
    options,
    colorClassName,
  } = useRating();

  const activeIndex = hoverIndex || selectedIndex;
  const isFilled = activeIndex >= index;
  const option = options[index - 1];
  const label = option?.label;
  const labelText = typeof label === 'string' && label.length > 0 ? label : undefined;
  const hasLabelText = labelText !== undefined;
  const labelTextOrEmpty = labelText ?? '';

  const Icon = iconType === 'circle' ? Circle : Star;

  const handleClick = () => {
    if (readOnly || disabled) return;
    setValueByIndex(index);
  };

  const handleMouseEnter = () => {
    if (readOnly || disabled) return;
    setHoverIndex(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (readOnly || disabled) return;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown': {
        event.preventDefault();
        setValueByIndex(Math.max(1, index - 1));
        break;
      }
      case 'ArrowRight':
      case 'ArrowUp': {
        event.preventDefault();
        setValueByIndex(Math.min(max, index + 1));
        break;
      }
      case 'Home': {
        event.preventDefault();
        setValueByIndex(1);
        break;
      }
      case 'End': {
        event.preventDefault();
        setValueByIndex(max);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        setValueByIndex(index);
        break;
      }
      default:
        break;
    }
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={index === selectedIndex}
      aria-label={labelText ?? `Rate ${index}`}
      title={labelText}
      disabled={disabled || readOnly}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center justify-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
        readOnly && 'cursor-default',
        !readOnly && !disabled && 'cursor-pointer hover:scale-110',
        disabled && 'opacity-50 cursor-not-allowed',
        colorClassName,
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          'transition-all',
          isFilled ? 'fill-current text-current' : 'fill-transparent text-foreground/30',
        )}
        size={size}
        aria-hidden="true"
      />
      {hasLabelText ? <span className="sr-only">{labelTextOrEmpty}</span> : null}
    </button>
  );
}

function Rating({
  value: valueProp,
  defaultValue,
  onValueChange,
  options: optionsProp,
  max: maxProp = DEFAULT_MAX_RATING,
  iconType = 'star',
  size = 'default',
  readOnly = false,
  disabled = false,
  name,
  required,
  color = 'default',
  className,
  children,
  ...props
}: React.PropsWithChildren<RatingProps>) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? 0);
  const [hoverIndex, setHoverIndex] = React.useState(0);

  const value = isControlled ? valueProp : internalValue;

  const options = React.useMemo(() => {
    const explicitOptions = optionsProp?.filter(Boolean);
    return explicitOptions && explicitOptions.length > 0
      ? explicitOptions
      : buildFallbackOptions(maxProp);
  }, [maxProp, optionsProp]);

  const max = options.length;
  const selectedIndex = React.useMemo(
    () => getIndexForValue(value, options),
    [options, value],
  );

  const setValue = React.useCallback(
    (nextValue: number) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const setValueByIndex = React.useCallback(
    (index: number) => {
      const clampedIndex = Math.min(Math.max(index, 1), max);
      const nextOption = options[clampedIndex - 1];
      if (!nextOption) return;
      setValue(nextOption.value);
    },
    [max, options, setValue],
  );

  const colorClassName = colorClasses[color];

  const contextValue = React.useMemo<RatingContextValue>(
    () => ({
      value,
      hoverIndex,
      selectedIndex,
      options,
      max,
      readOnly,
      disabled,
      size: sizePixels[size ?? 'default'],
      iconType,
      colorClassName,
      setHoverIndex,
      setValueByIndex,
    }),
    [
      colorClassName,
      disabled,
      hoverIndex,
      iconType,
      max,
      options,
      readOnly,
      selectedIndex,
      size,
      value,
      setValueByIndex,
    ],
  );

  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverIndex(0);
  };

  const nameText = typeof name === 'string' && name.length > 0 ? name : undefined;
  const hasNameText = nameText !== undefined;
  const nameTextOrEmpty = nameText ?? '';

  return (
    <RatingContext value={contextValue}>
      <div
        role="radiogroup"
        tabIndex={0}
        className={cn(ratingVariants({ size }), className)}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children ??
          Array.from({ length: max }, (_, index) => (
            <RatingButton key={index} index={index + 1} />
          ))}
        {hasNameText ? (
          <input
            type="hidden"
            name={nameTextOrEmpty}
            value={value || ''}
            required={required}
          />
        ) : null}
      </div>
    </RatingContext>
  );
}

export { Rating, RatingButton };
