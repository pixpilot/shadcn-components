'use client';

import type { ColorPickerBaseProps } from '../ColorPickerBase';

import {
  cn,
  ColorPickerSwatch,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@pixpilot/shadcn';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { ColorPickerBase } from '../ColorPickerBase';

export interface ColorPickerProps extends Omit<ColorPickerBaseProps, 'children'> {
  variant?: 'button' | 'input';
  placeholder?: string;
  formatDisplayValue?: (value: string) => React.ReactNode;
}

function Swatch(props: { color: string | undefined; className?: string }) {
  return (
    <ColorPickerSwatch
      color={props.color}
      className={cn('rounded-sm w-6.5 h-6.5 p-0 -ml-1 cursor-pointer', props.className)}
    />
  );
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const {
    variant = 'input',
    placeholder = 'Pick a color',
    formatDisplayValue,
    ...rest
  } = props;

  return (
    <ColorPickerBase {...rest}>
      {({ value, onValueChange, isPickerOpen }) => {
        const swatchColor = value != null && value !== '' ? value : undefined;

        const renderSwatch = (): React.ReactNode => {
          return <Swatch color={swatchColor} />;
        };

        const renderDisplayValue = (): React.ReactNode => {
          if (value == null || value === '') return placeholder;
          return formatDisplayValue != null ? formatDisplayValue(value) : value;
        };

        if (variant === 'input') {
          return (
            <InputGroup>
              <InputGroupAddon align="inline-start" className="pl-0">
                {renderSwatch()}
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
          <InputGroup
            className={cn(
              'dark:hover:bg-input/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
            )}
          >
            <InputGroupAddon align="inline-start" className="pl-0">
              {renderSwatch()}
            </InputGroupAddon>
            <InputGroupText className="flex-1 text-left text-foreground pl-2">
              {renderDisplayValue()}
            </InputGroupText>
            <InputGroupAddon align="inline-end" className="pr-1">
              {isPickerOpen ? (
                <ChevronUpIcon className="size-4 opacity-50" />
              ) : (
                <ChevronDownIcon className="size-4 opacity-50" />
              )}
            </InputGroupAddon>
          </InputGroup>
        );
      }}
    </ColorPickerBase>
  );
};

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
