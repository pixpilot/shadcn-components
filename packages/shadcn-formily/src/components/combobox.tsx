'use client';

import { connect, mapProps } from '@formily/react';

import { Combobox as BaseCombobox } from '@pixpilot/shadcn-ui';

export const Combobox = connect(
  BaseCombobox,
  mapProps({
    dataSource: 'options',
  }),
);
