import type { Field } from '@formily/core';

import type {
  AsyncIconProvider,
  IconPickerProps,
  IconProvider,
} from '@pixpilot/shadcn-ui';
import type { FC } from 'react';

import { connect, mapProps } from '@formily/react';
import { IconPicker as MainIconPicker, useAsyncProviders } from '@pixpilot/shadcn-ui';

import { useFormContext } from '../hooks';

const IconPickerBase: FC<
  Omit<IconPickerProps, 'providers'> & { providers?: IconProvider[] }
> = (props) => {
  const { providers: propProviders, ...restProps } = props;
  const { fields } = useFormContext();
  const { iconPicker } = fields || {};
  const { providers: contextProviders = [] } = iconPicker || {};

  // Use prop providers if provided, otherwise use context providers
  const providersToLoad: AsyncIconProvider[] =
    propProviders !== undefined ? propProviders : contextProviders;

  // Use async provider hook to resolve all providers

  const { providers: finalProviders, isLoading } = useAsyncProviders(providersToLoad);

  return (
    <MainIconPicker
      providers={finalProviders}
      isLoading={isLoading}
      {...restProps}
    ></MainIconPicker>
  );
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
