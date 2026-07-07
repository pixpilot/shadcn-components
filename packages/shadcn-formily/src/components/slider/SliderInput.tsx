import type { SliderInputProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect } from '@formily/react';

import { SliderInput as BaseSliderInput } from '@pixpilot/shadcn-ui';
import { sliderMapProps } from './map-props';

export const SliderInput: FC<SliderInputProps> = connect(BaseSliderInput, sliderMapProps);
