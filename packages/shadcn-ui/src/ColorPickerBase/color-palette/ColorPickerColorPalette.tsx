import type { PresetColor } from '../types';
import { cn } from '@pixpilot/shadcn';
import { Droplet } from 'lucide-react';
import React from 'react';
import { useColorPickerContext } from '../color-picker-context';
import { PaletteButton } from '../PaletteButton';
import { PaletteSwatch } from './PaletteSwatch';

export const COMMON_COLORS: PresetColor[] = [
  { label: 'Transparent', value: '#00000000' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Gray', value: '#808080' },
  { label: 'Red', value: '#FF0000' },
  { label: 'Orange', value: '#FFA500' },
  { label: 'Yellow', value: '#FFFF00' },
  { label: 'Lime', value: '#84CC16' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Cyan', value: '#00FFFF' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Brown', value: '#A52A2A' },
];

export interface ColorPickerColorPaletteProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  presetColors?: PresetColor[];
  onMoreColor?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ColorPickerColorPalette: React.FC<ColorPickerColorPaletteProps> = (props) => {
  const {
    presetColors = COMMON_COLORS,

    onMoreColor,
    ...rest
  } = props;

  const { value: selectedColor, onValueChange } = useColorPickerContext();

  return (
    <div {...rest} className={cn('gap-2 flex flex-wrap', rest.className)}>
      {presetColors.map((color) => (
        <PaletteSwatch
          key={color.value}
          color={color}
          onSelect={onValueChange}
          selectedValue={selectedColor}
        />
      ))}
      {onMoreColor && (
        <PaletteButton
          onClick={onMoreColor}
          aria-label="Toggle full color picker"
          className="flex items-center justify-center border-input bg-input hover:bg-accent hover:text-accent-foreground"
        >
          <Droplet className="h-4 w-4" />
        </PaletteButton>
      )}
    </div>
  );
};

ColorPickerColorPalette.displayName = 'ColorPickerColorPalette';

export { ColorPickerColorPalette };
