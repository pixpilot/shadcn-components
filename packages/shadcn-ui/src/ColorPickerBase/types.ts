import type { ColorPickerProps } from '@pixpilot/shadcn';

export interface PresetColor {
  label: string;
  value: string;
}

export type ColorPickerBaseSection = 'swatch' | 'picker' | 'format-select' | 'input';

export type ColorPickerBaseSections = ReadonlyArray<ColorPickerBaseSection>;

export interface ColorPickerBaseProps extends Omit<
  ColorPickerProps,
  'onChange' | 'children'
> {
  // options?: ColorPikerOptions;
  value?: string;
  onChange?: (value: string) => void;
  presetColors?: PresetColor[];
  layout?: 'full' | 'compact';
  /**
   * Controls which UI sections render in the picker content.
   * Defaults to all sections: ['swatch', 'picker', 'format-select', 'input'].
   */
  sections?: ColorPickerBaseSections;
  children: (props: {
    value?: string;
    onValueChange: (value: string) => void;
    isPickerOpen: boolean;
  }) => React.ReactNode;
}

export type ColorPickerContentProps = Required<
  Pick<ColorPickerBaseProps, 'onValueChange' | 'layout' | 'presetColors'>
> &
  Pick<ColorPickerBaseProps, 'sections'>;
