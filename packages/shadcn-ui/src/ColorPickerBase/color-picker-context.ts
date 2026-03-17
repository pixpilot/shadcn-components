import React from 'react';

export interface ColorPickerContextStates {
  isPickerOpen: boolean;
  value: string;
  onValueChange: (value: string) => void;
  openPicker: (open: boolean) => void;
}

const ColorPickerContext = React.createContext<ColorPickerContextStates>(
  {} as ColorPickerContextStates,
);
const { Provider, Consumer } = ColorPickerContext;

export function useColorPickerContext(): ColorPickerContextStates {
  return React.use(ColorPickerContext);
}
ColorPickerContext.displayName = 'ColorPickerContext';
export {
  ColorPickerContext,
  Consumer as ColorPickerContextContextConsumer,
  Provider as ColorPickerContextContextProvider,
};
