import { connect } from '@formily/react';

import { SliderInput as BaseSliderInput } from '@pixpilot/shadcn-ui';
import { sliderMapProps } from './map-props';

export const SliderInput = connect(BaseSliderInput, sliderMapProps);
