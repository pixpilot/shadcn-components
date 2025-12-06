export type Space = 'sm' | 'md' | 'lg';

export interface FormSpace {
  density?: 'compact' | 'normal' | 'comfortable' | 'responsive';
  responsive?: {
    mobile?: Space;
    tablet?: Space;
    desktop?: Space;
  };
}
