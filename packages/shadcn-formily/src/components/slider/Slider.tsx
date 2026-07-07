import type { SliderProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect } from '@formily/react';

import { Slider as ShadcnSlider } from '@pixpilot/shadcn-ui';
import { sliderMapProps } from './map-props';

export type { SliderProps } from '@pixpilot/shadcn-ui';

/**
 * Formily-connected Slider component
 * Range input for selecting numeric values
 */
export const Slider: FC<SliderProps> = connect(ShadcnSlider, sliderMapProps);
