import { isVoidField } from '@formily/core';
import { connect, mapProps } from '@formily/react';
import { cn } from '@internal/shadcn';
import React from 'react';

interface IFormItemProps extends React.ComponentProps<'div'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  asterisk?: boolean;
  feedbackStatus?: 'error' | 'warning' | 'success';
  feedbackText?: React.ReactNode;
}

/**
 * BaseFormItem component serves as a decorator for Formily fields
 * It provides label, error messages, and description display
 */
export const BaseFormItem: React.FC<React.PropsWithChildren<IFormItemProps>> = ({
  className,
  children,
  label,
  description,
  asterisk,
  feedbackStatus,
  feedbackText,
  ...props
}) => {
  return (
    <div data-slot="form-item" className={cn('grid gap-2', className)} {...props}>
      {label != null && (
        <label
          data-slot="form-label"
          data-error={Boolean(feedbackStatus === 'error')}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            feedbackStatus === 'error' && 'text-destructive',
          )}
        >
          {label}
          {asterisk && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {description != null && (
        <p className="text-muted-foreground text-[0.8rem]">{description}</p>
      )}

      <div className="relative">{children}</div>

      {Boolean(feedbackText) && feedbackStatus === 'error' && (
        <p className="text-destructive text-[0.8rem] font-medium">{feedbackText}</p>
      )}

      {Boolean(feedbackText) && feedbackStatus === 'warning' && (
        <p className="text-amber-600 text-[0.8rem]">{feedbackText}</p>
      )}

      {Boolean(feedbackText) && feedbackStatus === 'success' && (
        <p className="text-green-600 text-[0.8rem]">{feedbackText}</p>
      )}
    </div>
  );
};

/**
 * FormItem component connected to Formily field state
 * Automatically maps field validation state to component props
 */
export const FormItem = connect(
  BaseFormItem,
  mapProps((props, field) => {
    if (isVoidField(field)) {
      return {
        label: (field.title ?? props.label) as React.ReactNode,
        description: (props.description ?? field.description) as React.ReactNode,
        asterisk: props.asterisk,
      };
    }

    const takeFeedbackStatus = (): 'error' | 'warning' | 'success' | undefined => {
      if (field.validating) return undefined;
      if (field.selfErrors?.length) return 'error';
      if (field.selfWarnings?.length) return 'warning';
      if (field.selfSuccesses?.length) return 'success';
      return undefined;
    };

    const takeFeedbackText = (): React.ReactNode => {
      if (field.validating) return undefined;
      if (props.feedbackText != null) return props.feedbackText;
      if (field.selfErrors?.length) return field.selfErrors.join(', ');
      if (field.selfWarnings?.length) return field.selfWarnings.join(', ');
      if (field.selfSuccesses?.length) return field.selfSuccesses.join(', ');
      return undefined;
    };

    const takeAsterisk = (): boolean => {
      if (field.required && field.pattern !== 'readPretty') {
        return true;
      }
      if ('asterisk' in props) {
        return Boolean(props.asterisk);
      }
      return false;
    };

    return {
      label: (props.label ?? field.title) as React.ReactNode,
      description: (props.description ?? field.description) as React.ReactNode,
      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeFeedbackText(),
      asterisk: takeAsterisk(),
    };
  }),
);
