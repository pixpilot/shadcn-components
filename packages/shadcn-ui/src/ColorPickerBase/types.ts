import type { ColorPickerProps } from '@pixpilot/shadcn';

export interface ColorPickerBaseProps extends Omit<
  ColorPickerProps,
  'onChange' | 'children'
> {
  // options?: ColorPikerOptions;
  value?: string;
  onChange?: (value: string) => void;
  presetColors?: string[];
  layout?: 'full' | 'compact';
  children: (props: {
    value?: string;
    onValueChange: (value: string) => void;
    isPickerOpen: boolean;
  }) => React.ReactNode;
}

export type ColorPickerContentProps = Required<
  Pick<ColorPickerBaseProps, 'onValueChange' | 'layout' | 'presetColors'>
>;
