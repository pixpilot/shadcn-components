import type { Field } from '@formily/core';
import type { SliderProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps } from '@formily/react';
import { cn, Slider as ShadcnSlider } from '@pixpilot/shadcn-ui';

const SliderBase: React.FC<SliderProps> = (props) => {
  return <ShadcnSlider {...props} className={cn('py-2', props.className)} />;
};

/**
 * Formily-connected Slider component
 * Range input for selecting numeric values
 */
export const Slider = connect(
  SliderBase,
  mapProps((props, field) => {
    // eslint-disable-next-line ts/no-unsafe-assignment
    const fieldValue = (field as Field).value;
    const value = typeof fieldValue === 'number' ? [fieldValue] : [0];
    return {
      ...props,
      value,
      onValueChange: (newValue: number[]) => {
        (field as Field).setValue(newValue[0]);
      },
    };
  }),
);
