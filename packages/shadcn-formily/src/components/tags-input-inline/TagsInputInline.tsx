'use client';

import type { Field } from '@formily/core';
import type { TagsInputProps } from '@pixpilot/shadcn-ui';
import type { FC } from 'react';
import { connect, mapProps } from '@formily/react';

import { TagsInput as BaseTagsInputInLine } from '@pixpilot/shadcn-ui';

export type TagsInputInLineProps = TagsInputProps;

/**
 * Formily-connected TagsInputInLine component
 * Automatically connects shadcn-ui TagsInputInLine to Formily field state
 *
 * Based on DiceUI's tags-input for inline tag editing with keyboard navigation
 * and validation support.
 */
export const TagsInputInLine: FC<TagsInputInLineProps> = connect(
  BaseTagsInputInLine,
  mapProps((props, field) => {
    return {
      ...props,
      // eslint-disable-next-line ts/no-unsafe-assignment
      value: (field as Field).value ?? [],
    };
  }),
);
