'use client';

import type { ComboboxProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';

import { Combobox as BaseCombobox } from '@pixpilot/shadcn-ui';

export type { ComboboxProps } from '@pixpilot/shadcn-ui';

export const Combobox: FC<ComboboxProps> = connect(
  BaseCombobox,
  mapProps({
    dataSource: 'options',
  }),
);
