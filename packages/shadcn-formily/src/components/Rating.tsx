import { connect, mapProps } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import { Rating as BaseRating } from '@pixpilot/shadcn-ui';

/**
 * Formily-connected Rating component
 * Automatically connects shadcn-ui Rating to Formily field state
 */
export const Rating = connect(
  BaseRating,
  mapProps(
    {
      onInput: 'onValueChange',
    },
    (props, _field) => {
      return {
        ...props,
        // eslint-disable-next-line ts/no-unsafe-argument
        className: cn('h-9 flex items-center', props.className),
      };
    },
  ),
);
