import { cn, Slider as ShadcnSlider } from '@pixpilot/shadcn';
import React from 'react';

export interface SliderProps extends React.ComponentProps<typeof ShadcnSlider> {}

const Slider: React.FC<SliderProps> = (props) => {
  return <ShadcnSlider {...props} className={cn('py-2', props.className)} />;
};

Slider.displayName = 'Slider';

export { Slider };
