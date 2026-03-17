import type { ColorPickerContentProps } from './types';

import React from 'react';
import { ColorPickerColorPalette } from './color-palette';
import { ColorPickerContent } from './ColorPickerContent';
import { ColorPickerControls } from './ColorPickerControls';
import { ColorPickerFormatControls } from './ColorPickerFormatControls';

export interface ColorPickerFullControlsProps extends Omit<
  ColorPickerContentProps,
  'onValueChange' | 'currentValue'
> {}

const ColorPickerFullControls: React.FC<ColorPickerFullControlsProps> = React.memo(
  (props) => {
    const { presetColors, sections, ...rest } = props;

    const enabledSections = new Set(sections);
    const showPicker = enabledSections.has('picker');
    const showSwatch = enabledSections.has('swatch');
    const showFormatSelect = enabledSections.has('format-select');
    const showInput = enabledSections.has('input');

    return (
      <ColorPickerContent {...rest}>
        {showPicker && <ColorPickerControls />}

        {showSwatch && (
          <div className="gap-2  flex flex-wrap">
            <ColorPickerColorPalette presetColors={presetColors} />
          </div>
        )}

        {(showFormatSelect || showInput) && (
          <ColorPickerFormatControls
            showFormatSelect={showFormatSelect}
            showInput={showInput}
          />
        )}
      </ColorPickerContent>
    );
  },
);

ColorPickerFullControls.displayName = 'ColorPickerFullControls';

export { ColorPickerFullControls };
