import type { SliderSelectProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect } from '@formily/react';

import { SliderSelect as BaseSliderSelect } from '@pixpilot/shadcn-ui';
import { sliderSelectMapProps } from './map-props';

/**
 * Formily-connected SliderSelect component
 * Discrete slider that maps between provided options
 */
export const SliderSelect: FC<SliderSelectProps> = connect(
  BaseSliderSelect,
  sliderSelectMapProps,
);
