import type { GeneralField } from '@formily/core';
import type { SyncReactNode } from '../../types';
import type { FormItemProps } from './form-item-types';
import { isVoidField } from '@formily/core';
import { useFieldSchema } from '@formily/react';

/**
 * Maps Formily field state onto FormItem props (label, description, validation
 * feedback, required mark).
 *
 * Shared by every decorator that presents a field the way FormItem does —
 * FormItem itself plus the overlay decorators — so they stay in step.
 * Runs inside `mapProps`, which is why calling hooks here is allowed.
 */
export function mapFormItemProps(
  // `popover` is omitted so decorators that repurpose that name (PopoverItem)
  // still satisfy this signature; nothing here reads it.
  props: Omit<FormItemProps, 'popover'> & { asterisk?: boolean },
  field: GeneralField,
): Partial<Omit<FormItemProps, 'popover'>> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
}
