import type { ColorPickerContentProps } from './types';

import {
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
} from '@pixpilot/shadcn';

import React from 'react';
import { ColorPickerContent } from './ColorPickerContent';
import { ColorPickerInput } from './ColorPickerInput';
import { PaletteSwatch } from './PaletteSwatch';

export interface ColorPickerContentFullProps extends ColorPickerContentProps {}

const ColorPickerFull: React.FC<ColorPickerContentFullProps> = React.memo((props) => {
  const { onValueChange, presetColors, sections } = props;

  const enabledSections = new Set(sections);
  const showPicker = enabledSections.has('picker');
  const showSwatch = enabledSections.has('swatch');
  const showFormatSelect = enabledSections.has('format-select');
  const showInput = enabledSections.has('input');

  return (
    <ColorPickerContent>
      {showPicker && (
        <>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper className="hidden xs:flex " />
            <div className="flex-1 space-y-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
        </>
      )}

      {showSwatch && (
        <div className="gap-2  flex flex-wrap">
          {presetColors.map((color) => (
            <PaletteSwatch key={color.value} color={color} onSelect={onValueChange} />
          ))}
        </div>
      )}

      {(showFormatSelect || showInput) && (
        <div className="flex items-center gap-2 w-full">
          {showFormatSelect && <ColorPickerFormatSelect />}
          {showInput && <ColorPickerInput />}
        </div>
      )}
    </ColorPickerContent>
  );
});

ColorPickerFull.displayName = 'ColorPickerContentFull';

export { ColorPickerFull };
