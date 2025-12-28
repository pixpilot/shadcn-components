'use client';

import type { ColorPickerBaseProps } from '../ColorPickerBase';

import { cn, InputGroup, InputGroupAddon, InputGroupInput } from '@pixpilot/shadcn';

import { ChevronDownIcon } from 'lucide-react';
import { ColorPickerBase } from '../ColorPickerBase';
import { PaletteSwatch } from '../ColorPickerBase/PaletteSwatch';

export interface ColorPickerProps extends Omit<ColorPickerBaseProps, 'children'> {
  variant?: 'button' | 'input';
  placeholder?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { variant = 'input', placeholder = 'Pick a color', ...rest } = props;

  return (
    <ColorPickerBase {...rest}>
      {({ value, onValueChange, isPickerOpen }) => {
        if (variant === 'input') {
          return (
            <InputGroup>
              <InputGroupAddon align="inline-start" className="pl-1">
                <PaletteSwatch color={value} />
              </InputGroupAddon>
              <InputGroupInput
                value={value ?? ''}
                onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => {
                  if (isPickerOpen) return;
                  e.stopPropagation();
                }}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  if (isPickerOpen) return;
                  e.stopPropagation();
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onValueChange(e.target.value)
                }
                placeholder={placeholder}
              />
            </InputGroup>
          );
        }

        return (
          <button
            type="button"
            className={cn(
              'border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9',
            )}
          >
            <div className="flex items-center gap-2">
              <PaletteSwatch color={value} />
              <span className="text-foreground">{value ?? placeholder}</span>
            </div>
            <ChevronDownIcon className="size-4 opacity-50" />
          </button>
        );
      }}
    </ColorPickerBase>
  );
};

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
