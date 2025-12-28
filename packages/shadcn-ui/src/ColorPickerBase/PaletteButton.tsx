import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface PaletteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties;
}

const PaletteButton: React.FC<PaletteButtonProps> = (props) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'w-6.5 h-6.5 rounded border border-input focus:outline-none focus:ring-2 focus:ring-ring',
        props.className,
      )}
    />
  );
};

PaletteButton.displayName = 'PaletteButton';

export { PaletteButton };
