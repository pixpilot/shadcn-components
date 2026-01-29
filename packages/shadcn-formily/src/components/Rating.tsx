import { connect, mapProps } from '@formily/react';
import { Rating as BaseRating } from '@pixpilot/shadcn-ui';

/**
 * Formily-connected Rating component
 * Automatically connects shadcn-ui Rating to Formily field state
 */
export const Rating = connect(
  BaseRating,
  mapProps({
    onInput: 'onValueChange',
  }),
);
