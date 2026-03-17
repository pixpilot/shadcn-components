import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface ColorPickerPaletteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties;
}

export const COLOR_PICKER_PALETTE_BUTTON_CLASSES =
  'w-6.5 h-6.5 rounded border border-input focus:outline-none focus:ring-2 focus:ring-ring';

const ColorPickerPaletteButton: React.FC<ColorPickerPaletteButtonProps> = (props) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(COLOR_PICKER_PALETTE_BUTTON_CLASSES, props.className)}
    />
  );
};

ColorPickerPaletteButton.displayName = 'PaletteButton';

export { ColorPickerPaletteButton };
