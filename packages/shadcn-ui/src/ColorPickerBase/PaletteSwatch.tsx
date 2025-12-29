import { useCallback } from 'react';
import { PaletteButton } from './PaletteButton';

export const PaletteSwatch: React.FC<{
  color?: string;
  onSelect?: (color: string) => void;
  className?: string;
}> = ({ color, onSelect, className }) => {
  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(color ?? 'rgb(0,0,0,0)');
    }
  }, [color, onSelect]);

  const style = {
    backgroundImage: `linear-gradient(${color}, ${color}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)`,
    backgroundSize: 'auto, 8px 8px',
  };

  return <PaletteButton style={style} className={className} onClick={handleClick} />;
};
