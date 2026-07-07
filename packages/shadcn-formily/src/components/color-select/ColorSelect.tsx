import type { ColorSelectProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';

import { ColorSelect as BaseColorSelect } from '@pixpilot/shadcn-ui';

export type { ColorSelectProps } from '@pixpilot/shadcn-ui';

export const ColorSelect: FC<ColorSelectProps> = connect(
  BaseColorSelect,
  mapProps({
    dataSource: 'options',
  }),
);
