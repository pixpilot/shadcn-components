import type { RatingProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import { Rating as BaseRating } from '@pixpilot/shadcn-ui';

export type { RatingProps } from '@pixpilot/shadcn-ui';

/**
 * Formily-connected Rating component
 * Automatically connects shadcn-ui Rating to Formily field state
 */
export const Rating: FC<RatingProps> = connect(
  BaseRating,
  mapProps(
    {
      onInput: 'onValueChange',
    },
    (props, _field) => {
      return {
        ...props,
        className: cn('h-9 flex items-center', props.className),
      };
    },
  ),
);
