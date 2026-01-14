import type { ColorPickerContentProps } from './types';

import {
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
} from '@pixpilot/shadcn';
import { Droplet } from 'lucide-react';
import React, { useState } from 'react';
import { ColorPickerContent } from './ColorPickerContent';
import { ColorPickerInput } from './ColorPickerInput';
import { PaletteButton } from './PaletteButton';
import { PaletteSwatch } from './PaletteSwatch';

export interface ColorPickerContentFullProps extends ColorPickerContentProps {}

const ColorPickerCompact: React.FC<ColorPickerContentFullProps> = React.memo((props) => {
  const { onValueChange, presetColors, sections, currentValue, ...rest } = props;

  const enabledSections = new Set(sections);
  const showPicker = enabledSections.has('picker');
  const showSwatch = enabledSections.has('swatch');
  const showFormatSelect = enabledSections.has('format-select');
  const showInput = enabledSections.has('input');

  const [showFullPicker, setShowFullPicker] = useState(false);

  const shouldShowPickerUi = showPicker && (showSwatch ? showFullPicker : true);
  const canTogglePickerUi = showPicker && showSwatch;

  return (
    <ColorPickerContent {...rest}>
      {shouldShowPickerUi && (
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
            <PaletteSwatch
              key={color.value}
              color={color}
              onSelect={onValueChange}
              selectedValue={currentValue}
            />
          ))}
          {canTogglePickerUi && (
            <PaletteButton
              onClick={() => setShowFullPicker(!showFullPicker)}
              aria-label="Toggle full color picker"
              className="flex items-center justify-center border-input bg-input hover:bg-accent hover:text-accent-foreground"
            >
              <Droplet className="h-4 w-4" />
            </PaletteButton>
          )}
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

ColorPickerCompact.displayName = 'ColorPickerCompact';

export { ColorPickerCompact };
