import { connect, mapProps } from '@formily/react';

import { Select as BaseSelect } from '@pixpilot/shadcn-ui';

export const Select = connect(
  BaseSelect,
  mapProps({
    dataSource: 'options',
  }),
);
