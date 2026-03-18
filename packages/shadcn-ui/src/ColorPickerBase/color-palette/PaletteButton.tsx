import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface ColorPickerPaletteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties;
  selected?: boolean;
}

export const COLOR_PICKER_PALETTE_BUTTON_CLASSES =
  'w-6.5 h-6.5 rounded border border-input focus:outline-none focus:ring-2 focus:ring-ring';

const ColorPickerPaletteButton: React.FC<ColorPickerPaletteButtonProps> = ({
  selected,
  ...props
}) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        COLOR_PICKER_PALETTE_BUTTON_CLASSES,
        selected && 'ring-2 ring-ring ring-offset-2 ring-offset-background border-ring',
        props.className,
      )}
      aria-pressed={selected}
    />
  );
};

ColorPickerPaletteButton.displayName = 'PaletteButton';

export { ColorPickerPaletteButton };
