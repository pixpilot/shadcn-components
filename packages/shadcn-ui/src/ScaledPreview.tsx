import React from 'react';

export interface ScaledPreviewSize {
  width: number;
  height: number;
}

export interface ScaledPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base content dimensions. Defaults to 1000×1000. */
  baseSize?: ScaledPreviewSize;
  /** Scale factor for preview box (e.g., 0.5 = 50% of baseSize). */
  scaleFactor: number;
  /** Explicit preview box size. If provided, ignores scaleFactor. */
  previewBoxSize?: ScaledPreviewSize;
  /** Padding in pixels (reduces available space for content scaling). */
  padding?: number;
  /** Manual content scale override (bypasses automatic fit calculation). */
  forceScale?: number;
  children: React.ReactNode;
}

const DEFAULT_BASE_SIZE = {
  width: 1000,
  height: 1000,
} as const;

const DEFAULT_PADDING = 0;
const PADDING_SIDES = 2;

export const ScaledPreview: React.FC<ScaledPreviewProps> = ({
  baseSize = DEFAULT_BASE_SIZE,
  scaleFactor,
  previewBoxSize,
  padding = DEFAULT_PADDING,
  forceScale,
  children,
  ...rest
}) => {
  const calculatedPreviewBoxSize = previewBoxSize || {
    width: scaleFactor * baseSize.width,
    height: scaleFactor * baseSize.height,
  };

  const calculatedScale = Math.min(
    (calculatedPreviewBoxSize.width - padding * PADDING_SIDES) / baseSize.width,
    (calculatedPreviewBoxSize.height - padding * PADDING_SIDES) / baseSize.height,
  );

  const finalScale = forceScale ?? calculatedScale;

  return (
    <div
      {...rest}
      data-slot="scaled-preview"
      style={{
        width: calculatedPreviewBoxSize.width,
        height: calculatedPreviewBoxSize.height,
        position: 'relative',
        ...rest.style,
      }}
    >
      <div
        data-slot="scaled-preview-content"
        className="absolute top-1/2 left-1/2"
        style={{
          width: baseSize.width,
          height: baseSize.height,
          transform: `translate(-50%, -50%) scale(${finalScale})`,
          transformOrigin: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

ScaledPreview.displayName = 'ScaledPreview';
