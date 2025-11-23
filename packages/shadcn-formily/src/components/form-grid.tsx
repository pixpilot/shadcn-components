import { cn } from '@internal/shadcn';
import React from 'react';

export interface IFormGridProps {
  minColumns?: number | number[];
  maxColumns?: number | number[];
  minWidth?: number;
  maxWidth?: number;
  breakpoints?: number[];
  columnGap?: number;
  rowGap?: number;
  colWrap?: boolean;
  strictAutoFit?: boolean;
  shouldVisible?: (node: any, grid: any) => boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * FormGrid component for responsive grid layouts in forms
 * Supports gridSpan on child elements via x-decorator-props
 */
export function FormGrid({
  // minColumns = 0,
  maxColumns = 3,
  columnGap = 16,
  rowGap = 16,
  className,
  style,
  children,
}: IFormGridProps) {
  const cols = typeof maxColumns === 'number' ? maxColumns : maxColumns[0] != null || 3;

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{
        ...style,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
      }}
    >
      {React.Children.map(children, async (child) => {
        if (!React.isValidElement(child)) return child;

        // Extract gridSpan from decorator props if available
        const props = child.props as Record<string, unknown>;
        const decoratorProps = props['x-decorator-props'] as
          | Record<string, unknown>
          | undefined;

        const gridSpan =
          (decoratorProps?.gridSpan as number | undefined) != null ||
          (props.gridSpan as number | undefined) != null ||
          1;

        return (
          <div
            style={{
              gridColumn: `span ${gridSpan}`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
