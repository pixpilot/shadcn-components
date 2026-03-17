import React from 'react';

export interface ColorPickerContextStates {
  isPickerOpen: boolean;
  color: string;
  onColorChange: (value: string) => void;
  openPicker: (open: boolean) => void;
}

const ColorPickerContext = React.createContext<ColorPickerContextStates>(
  {} as ColorPickerContextStates,
);
const { Provider, Consumer } = ColorPickerContext;

export function useColorPickerContext(): ColorPickerContextStates {
  return React.use(ColorPickerContext);
}

export {
  ColorPickerContext,
  Consumer as ColorPickerContextContextConsumer,
  Provider as ColorPickerContextContextProvider,
};
