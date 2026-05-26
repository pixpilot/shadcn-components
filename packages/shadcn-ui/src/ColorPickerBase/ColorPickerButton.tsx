import type { ColorPickerResetOptions, ColorPickerSlots } from './types';
import {
  Button,
  cn,
  ColorPickerTrigger,
  InputGroup,
  InputGroupAddon,
} from '@pixpilot/shadcn';
import { ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useColorPickerContext } from './color-picker-context';
import { ColorPickerSwatch } from './ColorPickerSwatch';
import { useColorPickerResetOptions } from './hooks/use-color-picker-reset-options';

export interface ColorPickerButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'value'
> {
  formatDisplayValue?: (value: string) => React.ReactNode;
  placeholder?: string;
  onClear?: () => void;
  resetOptions?: ColorPickerResetOptions;
  slots?: ColorPickerSlots;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = (props) => {
  const {
    slots,
    formatDisplayValue,
    placeholder = 'Pick a color',
    onClear,
    resetOptions,
    title,
    ...rest
  } = props;

  const { isPickerOpen, onValueChange } = useColorPickerContext();

  const {
    value,
    isResetValue,
    resetLabel,
    resetTooltip,
    resetIcon,
    handleClear,
    showClearButton,
    swatchColor,
  } = useColorPickerResetOptions({
    resetOptions,
    onClear,
  });

  // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    if (onValueChange === undefined) {
      throw new Error(
        'ColorPickerButton must be used within a ColorPickerRoot component',
      );
    }
  }

  const renderDisplayValue = (): React.ReactNode => {
    if (isResetValue) return resetLabel;
    if (value == null || value === '') return placeholder;
    return formatDisplayValue != null ? formatDisplayValue(value) : value;
  };

  const swatchChildren =
    slots?.swatch?.children ?? (isResetValue ? resetIcon : undefined);

  return (
    <ColorPickerTrigger asChild>
      <InputGroup
        {...rest}
        title={title}
        className={cn(
          'dark:hover:bg-input/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
          rest.className,
        )}
      >
        <InputGroupAddon align="inline-start">
          <ColorPickerSwatch color={swatchColor} {...slots?.swatch}>
            {swatchChildren}
          </ColorPickerSwatch>
        </InputGroupAddon>
        <span className="flex-1 min-w-0 block truncate text-left text-foreground pl-2">
          {renderDisplayValue()}
        </span>
        <InputGroupAddon align="inline-end" className="gap-1">
          {showClearButton && (
            <Button
              type="button"
              title={resetTooltip}
              variant="ghost"
              size="icon"
              aria-label="Clear color"
              {...slots?.clearButton}
              className={cn(
                'size-6 shrink-0 rounded-full',
                slots?.clearButton?.className,
              )}
              onPointerDown={(e) => {
                slots?.clearButton?.onPointerDown?.(e);
                if (e.defaultPrevented) return;
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                slots?.clearButton?.onClick?.(e);
                if (e.defaultPrevented) return;
                e.preventDefault();
                e.stopPropagation();
                handleClear?.();
              }}
            >
              <XIcon className="size-4 opacity-50" />
            </Button>
          )}
          {isPickerOpen ? (
            <ChevronUpIcon className="size-4 opacity-50" />
          ) : (
            <ChevronDownIcon className="size-4 opacity-50" />
          )}
        </InputGroupAddon>
      </InputGroup>
    </ColorPickerTrigger>
  );
};

ColorPickerButton.displayName = 'ColorPickerButton';

export { ColorPickerButton };
