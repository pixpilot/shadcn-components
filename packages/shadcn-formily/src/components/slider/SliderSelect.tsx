import { connect } from '@formily/react';

import { SliderSelect as BaseSliderSelect } from '@pixpilot/shadcn-ui';
import { sliderSelectMapProps } from './map-props';

/**
 * Formily-connected SliderSelect component
 * Discrete slider that maps between provided options
 */
export const SliderSelect = connect(BaseSliderSelect, sliderSelectMapProps);
