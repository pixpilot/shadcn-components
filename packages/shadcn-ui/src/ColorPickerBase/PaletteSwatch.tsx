import { useCallback } from 'react';
import { PaletteButton } from './PaletteButton';

export const PaletteSwatch: React.FC<{
  color?: string;
  onSelect?: (color: string) => void;
  className?: string;
}> = ({ color, onSelect, className }) => {
  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(color ?? 'transparent');
    }
  }, [color, onSelect]);

  const isTransparent = color == null || color === 'transparent';
  const style = isTransparent
    ? {
        backgroundColor: 'transparent',
        backgroundImage:
          'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
        backgroundSize: '4px 4px',
        backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px',
      }
    : { backgroundColor: color };

  return <PaletteButton style={style} className={className} onClick={handleClick} />;
};
