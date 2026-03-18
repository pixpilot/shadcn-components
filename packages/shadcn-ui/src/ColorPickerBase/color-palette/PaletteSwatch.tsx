import type { PresetColor } from '../types';
import { colorUtils, Tooltip, TooltipContent, TooltipTrigger } from '@pixpilot/shadcn';
import { useCallback } from 'react';
import { ColorPickerPaletteButton } from './PaletteButton';

const ColorPickerPaletteSwatch: React.FC<{
  color?: PresetColor;
  onSelect?: (color: string) => void;
  className?: string;
  selectedValue?: string;
}> = ({ color, onSelect, className, selectedValue }) => {
  const colorValue = color?.value ?? 'rgb(0,0,0,0)';
  const colorLabel = color?.label;

  const normalizeColor = useCallback((value: string): string | null => {
    const parsed = colorUtils.parseColorString(value);
    if (!parsed) return null;
    return colorUtils.colorToString(parsed, 'hex').trim().toLowerCase();
  }, []);

  const isSelected = (() => {
    if (selectedValue === undefined || selectedValue.trim() === '') return false;
    const a = normalizeColor(selectedValue);
    const b = normalizeColor(colorValue);
    if (a === null || b === null) return false;
    return a === b;
  })();

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(colorValue);
    }
  }, [colorValue, onSelect]);

  const style = {
    backgroundImage: `linear-gradient(${colorValue}, ${colorValue}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)`,
    backgroundSize: 'auto, 8px 8px',
  };

  const button = (
    <ColorPickerPaletteButton
      style={style}
      className={className}
      selected={isSelected}
      onClick={handleClick}
    />
  );

  if (colorLabel === null || colorLabel === undefined || colorLabel === '') {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">
        <p>{colorLabel}</p>
      </TooltipContent>
    </Tooltip>
  );
};

ColorPickerPaletteSwatch.displayName = 'ColorPickerPaletteSwatch';

export { ColorPickerPaletteSwatch };
