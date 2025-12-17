import React, { useMemo } from 'react';
import { getGlobalStyles } from './styles';

export const CircleLoaderSize = {
  sm: 24,
  md: 40, // default
  lg: 64,
  xl: 96,
} as const;

export type CircleLoaderSizeKey = keyof typeof CircleLoaderSize;

const DEFAULT_SIZE = 40; // Keep original default
const MIN_STROKE_WIDTH = 2;
const STROKE_WIDTH_RATIO = 0.1; // 10% of size
const DEFAULT_SPEED = 2;
const DEFAULT_COLOR = 'currentColor';
const VIEWBOX_STROKE_REF = 40; // Reference width for scaling stroke width in the SVG viewBox
const PERCENT_MULTIPLIER = 100;

let spinnerIdCounter = 0;

export interface CircleLoaderProps {
  /**
   * Size of the spinner - can be a preset ('sm', 'md', 'lg', 'xl') or a number in pixels
   * @default 'md' (40px)
   */
  size?: CircleLoaderSizeKey | number;
  /**
   * Width of the spinner stroke in pixels
   * If not provided, automatically calculated as 10% of size (minimum 2px)
   * @default Auto-calculated based on size
   */
  strokeWidth?: number;
  /**
   * Duration of rotation animation in seconds
   * @default 2
   */
  speed?: number;
  /**
   * Single color for the spinner
   * Use 'currentColor' to inherit text color from parent (works with dark/light mode)
   * @default 'currentColor'
   */
  color?: string;
  /**
   * Array of colors for color-changing animation
   * If provided, overrides the color prop
   */
  colors?: string[];
  /**
   * Additional CSS class name
   */
  className?: string;
}

export const CircleLoader: React.FC<CircleLoaderProps> = ({
  size: sizeProp = DEFAULT_SIZE,
  strokeWidth: strokeWidthProp,
  speed = DEFAULT_SPEED,
  color = DEFAULT_COLOR,
  colors,
  className = '',
}) => {
  // Resolve size to a number
  const size = typeof sizeProp === 'string' ? CircleLoaderSize[sizeProp] : sizeProp;

  // Calculate stroke width automatically if not provided (10% of size, minimum 2)
  const strokeWidth =
    strokeWidthProp ?? Math.max(MIN_STROKE_WIDTH, Math.round(size * STROKE_WIDTH_RATIO));

  const uniqueId = useMemo(() => `spinner-${++spinnerIdCounter}-${Date.now()}`, []);
  const viewBoxStrokeWidth = (strokeWidth / size) * VIEWBOX_STROKE_REF;

  const CIRCLE_RADIUS = 20;

  const getColorAnimationId = () => {
    if (!colors || colors.length === 0) return '';
    return `${uniqueId}-color-change`;
  };

  const getColorAnimationKeyframes = () => {
    if (!colors || colors.length === 0) return '';
    const keyframes = colors
      .map((c, i) => {
        const percent = (i / colors.length) * PERCENT_MULTIPLIER;
        return `${percent}% { stroke: ${c}; }`;
      })
      .join('\n');

    return `
      @keyframes ${getColorAnimationId()} {
        ${keyframes}
        100% { stroke: ${colors[0]}; }
      }
    `;
  };

  return (
    <>
      <style>
        {getGlobalStyles({
          uniqueId,
          speed,
          size,
          colors,
          color,
          strokeWidth,
        })}
        {colors && colors.length > 0 && getColorAnimationKeyframes()}
      </style>

      <div className={`${uniqueId}-loader ${className}`}>
        <svg
          className={`${uniqueId}-circular`}
          viewBox="25 25 50 50"
          width="100%"
          height="100%"
        >
          <circle
            className={`${uniqueId}-path`}
            cx={50}
            cy={50}
            r={CIRCLE_RADIUS}
            fill="none"
            strokeWidth={viewBoxStrokeWidth}
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </>
  );
};

CircleLoader.displayName = 'CircleLoader';
