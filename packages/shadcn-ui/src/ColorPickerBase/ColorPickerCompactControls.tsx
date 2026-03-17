import type { ColorPickerContentProps } from './types';

import React, { useState } from 'react';
import { ColorPickerColorPalette } from './color-palette';
import { useColorPickerContext } from './color-picker-context';
import { ColorPickerContent } from './ColorPickerContent';
import { ColorPickerControls } from './ColorPickerControls';
import { ColorPickerFormatControls } from './ColorPickerFormatControls';

import { DEFAULT_SECTIONS } from './constants';

export interface ColorPickerCompactControlsProps extends Omit<
  ColorPickerContentProps,
  'onValueChange' | 'currentValue'
> {}

const ColorPickerCompactControls: React.FC<ColorPickerCompactControlsProps> = React.memo(
  (props) => {
    const { presetColors, sections = DEFAULT_SECTIONS, ...rest } = props;

    const { onColorChange, color: currentColor } = useColorPickerContext();

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
        {shouldShowPickerUi && <ColorPickerControls />}

        {showSwatch && (
          <div className="gap-2  flex flex-wrap">
            <ColorPickerColorPalette
              presetColors={presetColors}
              onChange={onColorChange}
              selectedColor={currentColor}
              onMoreColor={
                canTogglePickerUi ? () => setShowFullPicker(!showFullPicker) : undefined
              }
            />
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

ColorPickerCompactControls.displayName = 'ColorPickerCompactControls';

export { ColorPickerCompactControls };
