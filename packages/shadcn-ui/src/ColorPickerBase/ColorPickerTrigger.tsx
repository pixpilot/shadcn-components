import { ColorPickerTrigger as OrgColorPickerTrigger } from '@pixpilot/shadcn';
import React from 'react';

export type ColorPickerTriggerProps = React.ComponentPropsWithoutRef<
  typeof OrgColorPickerTrigger
>;
const ColorPickerTrigger: React.FC<ColorPickerTriggerProps> = (props) => {
  return <OrgColorPickerTrigger asChild className="w-full " {...props} />;
};

ColorPickerTrigger.displayName = 'ColorPickerTrigger';

export { ColorPickerTrigger };
