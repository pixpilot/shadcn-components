import type { ColorPickerProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps } from '@formily/react';
import { ColorPicker as MainColorPicker } from '@pixpilot/shadcn-ui';

const ColorPickerBase: React.FC<ColorPickerProps> = (props) => {
  return <MainColorPicker {...props} />;
};

export const ColorPicker = connect(
  ColorPickerBase,
  mapProps(
    {
      onInput: 'onValueChange',
    },
    (props) => {
      return props;
    },
  ),
);
