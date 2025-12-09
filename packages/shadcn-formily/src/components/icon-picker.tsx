import type { Field } from '@formily/core';

import type {
  IconPickerProps,
  IconProvider,
  IconProviderProps,
} from '@pixpilot/shadcn-ui';
import type { FC } from 'react';

import { connect, mapProps } from '@formily/react';
import { IconPicker as MainIconPicker } from '@pixpilot/shadcn-ui';

import { useFormContext } from '../hooks';

const IconPickerBase: FC<
  Omit<IconPickerProps, 'providers'> & { providers?: IconProviderProps[] }
> = (props) => {
  const { providers: propProviders, ...restProps } = props;
  const { fields } = useFormContext();
  const { iconPicker } = fields || {};
  const { providers: contextProviders = [] } = iconPicker || {};

  // Use prop providers if provided, otherwise use context providers
  const providersToLoad: IconProvider[] =
    propProviders !== undefined ? propProviders : contextProviders;

  return <MainIconPicker {...restProps} providers={providersToLoad}></MainIconPicker>;
};

/**
 * Formily-connected IconPicker component
 * Automatically connects to Formily field state
 * Supports both static and async icon providers
 */
export const IconPicker = connect(
  IconPickerBase,
  mapProps((props, field) => {
    const formField = field as unknown as Field;
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: formField.value ?? '',
    };
  }),
);
