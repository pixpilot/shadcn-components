'use client';

import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';

import { Combobox as BaseCombobox } from '@pixpilot/shadcn-ui';

export const Combobox: FC = connect(
  BaseCombobox,
  mapProps({
    dataSource: 'options',
  }),
);
