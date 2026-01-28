import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';

import { Select as BaseSelect } from '@pixpilot/shadcn-ui';

interface SelectProps {
  options?: Array<{ value: string | number; label: string }>;
  mapOption?: (option: { value: string | number; label: string }) => {
    value: string | number;
    label: string;
  };
  [key: string]: any;
}

const SelectComponent: FC<SelectProps> = ({ mapOption, options, ...props }) => {
  const transformedOptions = options?.map((option) =>
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
