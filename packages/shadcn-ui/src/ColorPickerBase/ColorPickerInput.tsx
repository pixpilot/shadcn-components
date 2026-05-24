import type { ColorPickerResetOptions } from './types';
import {
  Button,
  cn,
  ColorPickerTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@pixpilot/shadcn';
import { XIcon } from 'lucide-react';
import React from 'react';
import { useColorPickerContext } from './color-picker-context';
import { ColorPickerSwatch } from './ColorPickerSwatch';
import { useColorPickerResetOptions } from './hooks/use-color-picker-reset-options';

export interface ColorPickerInputProps extends Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value'
> {
  onClear?: () => void;
  resetOptions?: ColorPickerResetOptions;
  slots?: {
    swatch?: React.ComponentProps<typeof ColorPickerSwatch>;
    clearButton?: React.ComponentProps<typeof Button>;
  };
}

const ColorPickerInput: React.FC<ColorPickerInputProps> = (props) => {
  const { slots, onChange, onClear, resetOptions, placeholder, title, ...rest } = props;

  const { isPickerOpen, onValueChange } = useColorPickerContext();

  const {
    value,
    isResetValue,
    resetLabel,
    resetTooltip,
    resetIcon,
    handleClear,
    showClearButton,
    currentcolor,
  } = useColorPickerResetOptions({
    resetOptions,
    onClear,
  });

  // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    if (onValueChange === undefined) {
      throw new Error('ColorPickerInput must be used within a ColorPickerRoot component');
    }
  }

  const inputValue = isResetValue ? '' : (value ?? '');
  const inputPlaceholder = isResetValue ? resetLabel : placeholder;
  const swatchChildren =
    slots?.swatch?.children ?? (isResetValue ? resetIcon : undefined);

  return (
    <ColorPickerTrigger asChild>
      <InputGroup className="w-full">
        <InputGroupAddon align="inline-start">
          <ColorPickerSwatch color={currentcolor} {...slots?.swatch}>
            {swatchChildren}
          </ColorPickerSwatch>
        </InputGroupAddon>
        <InputGroupInput
          value={inputValue}
          {...rest}
          title={title}
          placeholder={inputPlaceholder}
          onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => {
            rest.onPointerDown?.(e);
            if (isPickerOpen) return;
            e.stopPropagation();
          }}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            rest.onClick?.(e);
            if (isPickerOpen) return;
            e.stopPropagation();
          }}
          onChange={(e) => {
            onValueChange(e.target.value);
            onChange?.(e);
          }}
        />
        {showClearButton ? (
          <InputGroupAddon align="inline-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear color"
              title={resetTooltip}
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
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </ColorPickerTrigger>
  );
};

ColorPickerInput.displayName = 'ColorPickerInput';

export { ColorPickerInput };
