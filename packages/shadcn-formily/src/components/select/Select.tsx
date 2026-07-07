import type { SelectProps as BaseSelectProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps, useField } from '@formily/react';

import { Select as BaseSelect } from '@pixpilot/shadcn-ui';

import { resolveFieldOptions } from '../../utils/resolve-field-options';

export type { SelectProps as BaseSelectProps } from '@pixpilot/shadcn-ui';

export interface SelectProps extends Omit<BaseSelectProps, 'options'> {
  options?: Array<{ value: string | number; label: string }>;
  mapOption?: (option: { value: string | number; label: string }) => {
    value: string | number;
    label: string;
  };
}

const SelectComponent: FC<SelectProps> = ({ mapOption, options, ...props }) => {
  const field = useField();

  const resolvedOptions = resolveFieldOptions({ field, options });
  const transformedOptions = resolvedOptions?.map((option) => {
    const normalizedOption = {
      value: option.value,
      label: typeof option.label === 'string' ? option.label : String(option.value),
    };

    return mapOption ? mapOption(normalizedOption) : normalizedOption;
  });

  return <BaseSelect {...props} options={transformedOptions} />;
};

export const Select: FC<SelectProps> = connect(
  SelectComponent,
  mapProps({
    dataSource: 'options',
  }),
);
