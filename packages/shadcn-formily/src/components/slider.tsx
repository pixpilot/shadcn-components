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
  mapProps(
    {
      value: true,
      onInput: true,
    },
    (props, field) => {
      // eslint-disable-next-line ts/no-unsafe-assignment
      const fieldValue = (field as Field).value;
      let value: number[];
      if (Array.isArray(fieldValue)) {
        value = fieldValue as number[];
      } else if (typeof fieldValue === 'number') {
        value = [fieldValue];
      } else {
        value = [0];
      }

      return {
        ...props,
        value,
        onValueChange: (newValue: number[]) => {
          if (Array.isArray((field as Field).value)) {
            (field as Field).onInput(newValue).catch(() => {});
          } else {
            (field as Field).onInput(newValue[0]).catch(() => {});
          }
        },
      };
    },
  ),
);
