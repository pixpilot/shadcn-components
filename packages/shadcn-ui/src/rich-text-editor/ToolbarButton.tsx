import { cn } from '@pixpilot/shadcn';

import React from 'react';
import { Button } from '../Button';
import { isSvgMarkupString, svgMarkupToMaskUrl } from '../utils';

export type ToolbarButtonTooltipMode = 'native' | 'custom';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  tooltip: string;
  tooltipMode?: ToolbarButtonTooltipMode;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  disabled,
  className,
  children,
  tooltip,
  tooltipMode,
}) => {
  return (
    <Button
      {...(tooltipMode === 'native' ? { title: tooltip } : { tooltip })}
      type="button"
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      onMouseDown={(event) => {
        // Prevent the toolbar button from taking focus away from the editor.
        event.preventDefault();
      }}
      onClick={onClick}
      disabled={disabled}
      className={cn('h-8 w-8 p-0', className)}
    >
      {isSvgMarkupString(children) ? (
        <span
          data-slot="svg-mask"
          aria-hidden="true"
          className="inline-block h-4 w-4"
          style={{
            backgroundColor: 'currentColor',
            WebkitMaskImage: svgMarkupToMaskUrl(children),
            maskImage: svgMarkupToMaskUrl(children),
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ) : (
        children
      )}
    </Button>
  );
};
