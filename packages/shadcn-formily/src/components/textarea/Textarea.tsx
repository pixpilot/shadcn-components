import type { Field } from '@formily/core';
import type { ComponentProps, FC } from 'react';
import { connect, mapProps } from '@formily/react';
import { Textarea as ShadcnTextarea } from '@pixpilot/shadcn';

export type TextareaProps = ComponentProps<typeof ShadcnTextarea>;

/**
 * Formily-connected Textarea component
 */
export const Textarea: FC<TextareaProps> = connect(
  ShadcnTextarea,
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? '',
    };
  }),
);
