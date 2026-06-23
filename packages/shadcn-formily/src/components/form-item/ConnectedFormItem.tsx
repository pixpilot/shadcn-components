import type { SyncReactNode } from '../../types';
import { isVoidField } from '@formily/core';
import { connect, mapProps, useFieldSchema } from '@formily/react';

import { BaseFormItem } from './BaseFormItem';

/**
 * FormItem component connected to Formily field state.
 * Automatically maps field validation state to component props.
 */
export const FormItem = connect(
  BaseFormItem,
  mapProps((props, field) => {
    const schema = useFieldSchema();

    if (isVoidField(field)) {
      return {
        label: (field.title ?? props.label) as SyncReactNode,
        description: (props.description ?? field.description) as SyncReactNode,
        requiredMark:
          props.requiredMark !== undefined ? props.requiredMark : props.asterisk,
      };
    }

    const takeFeedbackStatus = (): 'error' | 'warning' | 'success' | undefined => {
      if (field.validating) return undefined;
      if (field.selfErrors?.length) return 'error';
      if (field.selfWarnings?.length) return 'warning';
      if (field.selfSuccesses?.length) return 'success';
      return undefined;
    };

    const takeFeedbackText = (): SyncReactNode => {
      if (field.validating) return undefined;
      if (props.feedbackText != null) return props.feedbackText;
      if (field.selfErrors?.length) return field.selfErrors.join(', ');
      if (field.selfWarnings?.length) return field.selfWarnings.join(', ');
      if (field.selfSuccesses?.length) return field.selfSuccesses.join(', ');
      return undefined;
    };

    let resolvedRequiredMark = props.requiredMark;

    if (resolvedRequiredMark === undefined) {
      if (props.asterisk !== undefined) {
        resolvedRequiredMark = Boolean(props.asterisk);
      } else if (
        schema.parent &&
        Array.isArray(schema.parent.required) &&
        schema.parent.required.includes(schema.name as string)
      ) {
        resolvedRequiredMark = true;
      } else {
        resolvedRequiredMark = field.required && field.pattern !== 'readPretty';
      }
    }

    return {
      label: (props.label ?? field.title) as SyncReactNode,
      description: (props.description ?? field.description) as SyncReactNode,
      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeFeedbackText(),
      requiredMark: resolvedRequiredMark,
    };
  }),
);
