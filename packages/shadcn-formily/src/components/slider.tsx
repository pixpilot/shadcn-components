import type { Field } from '@formily/core';
import { connect, mapProps } from '@formily/react';
import { Slider as ShadcnSlider } from '@internal/shadcn';

/**
 * Formily-connected Slider component
 * Range input for selecting numeric values
 */
export const Slider = connect(
  ShadcnSlider,
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
