import type { PresetColor } from './types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@pixpilot/shadcn';
import { useCallback } from 'react';
import { PaletteButton } from './PaletteButton';

export const PaletteSwatch: React.FC<{
  color?: PresetColor;
  onSelect?: (color: string) => void;
  className?: string;
}> = ({ color, onSelect, className }) => {
  const colorValue = color?.value ?? 'rgb(0,0,0,0)';
  const colorLabel = color?.label;

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
    <PaletteButton style={style} className={className} onClick={handleClick} />
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
