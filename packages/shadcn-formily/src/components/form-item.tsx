/* eslint-disable react/no-clone-element */
import { isVoidField } from '@formily/core';
import { connect, mapProps, useField } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
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
  const field = useField();

  const id =
    (field?.componentProps?.id as string) ??
    `form-${field?.address?.toString()?.replace(/\./gu, '-')}`;

  const descriptionId = React.useId();
  const feedbackId = React.useId();

  const ariaDescribedBy = [
    description != null ? descriptionId : undefined,
    feedbackText != null ? feedbackId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      data-slot="form-item"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      {label != null && (
        <label
          htmlFor={id}
          data-slot="form-label"
          data-error={Boolean(feedbackStatus === 'error')}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            feedbackStatus === 'error' && 'text-destructive',
          )}
        >
          {label}
          {asterisk && (
            <span className="text-destructive ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description != null && (
        <p id={descriptionId} className="text-muted-foreground text-[0.8rem]">
          {description}
        </p>
      )}

      {/* Inject id into children only if they support it */}
      <div className="relative">
        {React.isValidElement(children)
          ? React.cloneElement(children, {
              id,
              'aria-describedby': ariaDescribedBy || undefined,
              'aria-invalid': feedbackStatus === 'error' ? 'true' : undefined,
            } as React.HTMLAttributes<HTMLElement>)
          : children}
      </div>

      {Boolean(feedbackText) && (
        <p
          id={feedbackId}
          className={cn(
            'text-[0.8rem]',
            feedbackStatus === 'error' && 'text-destructive font-medium',
            feedbackStatus === 'warning' && 'text-amber-600',
            feedbackStatus === 'success' && 'text-green-600',
          )}
        >
          {typeof feedbackText === 'string'
            ? feedbackText.split('\n').map((line: string, index: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                  {line}
                  {index < feedbackText.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))
            : feedbackText}
        </p>
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
