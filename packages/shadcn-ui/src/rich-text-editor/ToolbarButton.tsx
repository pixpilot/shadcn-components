import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from '@pixpilot/shadcn';

import React from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  tooltip: string;
}

function isSvgMarkupString(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  return trimmed.startsWith('<svg') && trimmed.endsWith('</svg>');
}

function svgMarkupToMaskUrl(svgMarkup: string): string {
  const encoded = encodeURIComponent(svgMarkup)
    .replace(/'/gu, '%27')
    .replace(/"/gu, '%22');
  return `url("data:image/svg+xml,${encoded}")`;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  disabled,
  className,
  children,
  tooltip,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
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
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);
