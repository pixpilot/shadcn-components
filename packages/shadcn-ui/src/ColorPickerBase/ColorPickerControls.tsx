import {
  cn,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerHueSlider,
} from '@pixpilot/shadcn';

import React from 'react';

export interface ColorPickerControlsProps extends React.ComponentProps<'div'> {
  slots?: {
    area: React.ComponentProps<typeof ColorPickerArea>;
    eyeDropper: React.ComponentProps<typeof ColorPickerEyeDropper>;
    hueSlider: React.ComponentProps<typeof ColorPickerHueSlider>;
    alphaSlider: React.ComponentProps<typeof ColorPickerAlphaSlider>;
  };
}

const ColorPickerControls: React.FC<ColorPickerControlsProps> = (props) => {
  const { slots, ...rest } = props;

  return (
    <div
      data-slot="color-picker-controls"
      {...rest}
      className={cn('space-y-4', rest.className)}
    >
      <ColorPickerArea {...slots?.area} />
      <div data-slot="color-picker-controls-row" className="flex items-center gap-2">
        <ColorPickerEyeDropper
          {...slots?.eyeDropper}
          className={cn('hidden xs:flex ', slots?.eyeDropper.className)}
        />
        <div data-slot="color-picker-controls-sliders" className="flex-1 space-y-2">
          <ColorPickerHueSlider {...slots?.hueSlider} />
          <ColorPickerAlphaSlider {...slots?.alphaSlider} />
        </div>
      </div>
    </div>
  );
};

ColorPickerControls.displayName = 'ColorPickerControls';

export {
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerControls,
  ColorPickerEyeDropper,
  ColorPickerHueSlider,
};
