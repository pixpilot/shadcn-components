import type { FC } from 'react';
import { connect, mapProps, useField } from '@formily/react';

import { Select as BaseSelect } from '@pixpilot/shadcn-ui';

interface SelectProps {
  options?: Array<{ value: string | number; label: string }>;
  mapOption?: (option: { value: string | number; label: string }) => {
    value: string | number;
    label: string;
  };
  [key: string]: any;
}

function isOptionArray(
  value: unknown,
): value is Array<{ value: string | number; label: string }> {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' && item !== null && 'value' in item && 'label' in item,
    )
  );
}

const SelectComponent: FC<SelectProps> = ({ mapOption, options, ...props }) => {
  const field = useField();

  let selectOptions: Array<{ value: string | number; label: string }> | undefined;
  if (isOptionArray(field?.componentProps?.options)) {
    selectOptions = field.componentProps.options;
  } else if (isOptionArray(options)) {
    selectOptions = options;
  }

  const transformedOptions = selectOptions?.map((option) =>
    mapOption ? mapOption(option) : option,
  );

  return <BaseSelect {...props} options={transformedOptions} />;
};

export const Select: FC = connect(
  SelectComponent,
  mapProps({
    dataSource: 'options',
  }),
);
