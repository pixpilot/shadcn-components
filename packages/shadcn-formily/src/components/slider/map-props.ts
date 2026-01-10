import type { Field } from '@formily/core';
import type {
  SliderProps,
  SliderSelectProps,
  SliderSelectValue,
} from '@pixpilot/shadcn-ui';
import { mapProps, useFieldSchema } from '@formily/react';

export const sliderMapProps = mapProps(
  {
    value: true,
    onInput: 'onValueChange',
  },
  (props, field) => {
    const sliderProps = props as SliderProps;
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
      ...sliderProps,
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

export const sliderSelectMapProps = mapProps(
  {
    value: true,
    onInput: 'onValueChange',
    dataSource: 'options',
  },
  (props, field) => {
    const sliderSelectProps = props as SliderSelectProps;
    const schema = useFieldSchema();

    // eslint-disable-next-line ts/no-unsafe-assignment
    const fieldValue = (field as Field).value;
    const value: SliderSelectValue | undefined =
      typeof fieldValue === 'string' || typeof fieldValue === 'number'
        ? (fieldValue as SliderSelectValue)
        : undefined;

    const enumOptions = Array.isArray(schema?.enum)
      ? (schema?.enum as SliderSelectValue[])
      : undefined;

    const options = sliderSelectProps.options ?? enumOptions ?? [];

    return {
      ...sliderSelectProps,
      options,
      value,
      onValueChange: (nextValue: SliderSelectValue) => {
        (field as Field).onInput(nextValue).catch(() => {});
      },
    };
  },
);
