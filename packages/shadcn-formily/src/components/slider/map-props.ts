import type { Field } from '@formily/core';
import type { Slider } from '@pixpilot/shadcn-ui';
import { mapProps, useFieldSchema } from '@formily/react';

// eslint-disable-next-line custom/no-typeof-shadcn-components
export const sliderMapProps = mapProps<typeof Slider>(
  {
    value: true,
    onInput: 'onValueChange',
  },
  (props, field) => {
    const schema = useFieldSchema();

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

    const min = schema?.minimum;
    const max = schema?.maximum;

    return {
      min,
      max,
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
);
