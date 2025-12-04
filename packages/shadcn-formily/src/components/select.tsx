import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';

import { Select as BaseSelect } from '@pixpilot/shadcn-ui';

export const Select: FC = connect(
  BaseSelect,
  mapProps({
    dataSource: 'options',
  }),
);
