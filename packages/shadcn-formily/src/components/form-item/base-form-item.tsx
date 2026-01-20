/* eslint-disable react/no-clone-element */

import type {
  DescriptionPlacement,
  FormItemLabelProps,
  FormItemProps,
  FormItemSlots,
  LabelPlacement,
} from './form-item-types';
import { useField } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';

import { useFormContext, useLabel } from '../../hooks';
import { FormItemLabel } from './form-item-label';
import { getSpacingConfig } from './spacing-config';

function resolveLegacyDescriptionPlacement(
  labelPlacement: LabelPlacement,
): Exclude<DescriptionPlacement, 'popover'> {
  return labelPlacement === 'top' ? 'top' : 'bottom';
}

/*
 * BaseFormItem component serves as a decorator for Formily fields.
 * It provides label, error messages, and description display.
 */
export const BaseFormItem: React.FC<React.PropsWithChildren<FormItemProps>> = ({
  className,
  children,
  label,
  description,
  descriptionPlacement,
  asterisk,
  feedbackStatus,
  feedbackText,
  slots,
  ...props
}) => {
  const field = useField();
  const fieldDecoratorProps = (field as unknown as { decoratorProps?: unknown })
    ?.decoratorProps as Record<string, unknown> | undefined;
  const fieldComponentProps = (field as unknown as { componentProps?: unknown })
    ?.componentProps as Record<string, unknown> | undefined;

  const fieldDecoratorSlots = fieldDecoratorProps?.slots as FormItemSlots | undefined;
  const fieldComponentSlots = fieldComponentProps?.slots as FormItemSlots | undefined;

  const fieldLabelProps: FormItemLabelProps | undefined =
    fieldDecoratorSlots?.label ??
    (fieldDecoratorProps?.labelProps as FormItemLabelProps | undefined) ??
    fieldComponentSlots?.label ??
    (fieldComponentProps?.labelProps as FormItemLabelProps | undefined);

  const effectiveLabel = useLabel(label);

  const { layout } = useFormContext();
  const itemComponentsProps = layout?.itemProps || {};
  const contextDescriptionPlacement = layout?.descriptionPlacement;
  const contextLabelPlacement = layout?.labelPlacement;

  const fieldLabelPlacement: LabelPlacement | undefined =
    fieldLabelProps?.placement ??
    (fieldDecoratorProps?.labelPlacement as LabelPlacement | undefined) ??
    (fieldComponentProps?.labelPlacement as LabelPlacement | undefined);

  const propLabelPlacement: LabelPlacement | undefined = slots?.label?.placement;

  const effectiveLabelPlacement: LabelPlacement =
    fieldLabelPlacement ?? propLabelPlacement ?? contextLabelPlacement ?? 'top';

  const fieldDescriptionPlacement: DescriptionPlacement | undefined =
    (fieldComponentProps?.descriptionPlacement as DescriptionPlacement | undefined) ??
    (fieldDecoratorProps?.descriptionPlacement as DescriptionPlacement | undefined);

  const effectiveDescriptionPlacement: DescriptionPlacement | undefined =
    fieldDescriptionPlacement ?? descriptionPlacement ?? contextDescriptionPlacement;

  const resolvedDescriptionPlacement: DescriptionPlacement =
    effectiveDescriptionPlacement ??
    resolveLegacyDescriptionPlacement(effectiveLabelPlacement);

  const id =
    (field?.componentProps?.id as string) ??
    `form-${field?.address?.toString()?.replace(/\./gu, '-')}`;

  const descriptionId = React.useId();
  const feedbackId = React.useId();

  const descriptionRenderedInline =
    description != null && resolvedDescriptionPlacement !== 'popover';

  const spacingConfig = getSpacingConfig(
    resolvedDescriptionPlacement,
    descriptionRenderedInline,
  );

  const ariaDescribedBy = [
    descriptionRenderedInline ? descriptionId : undefined,
    feedbackText != null ? feedbackId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const labelElement = effectiveLabel != null && (
    <FormItemLabel
      id={id}
      label={effectiveLabel}
      asterisk={asterisk}
      error={feedbackStatus === 'error'}
      shrink={effectiveLabelPlacement === 'end' || effectiveLabelPlacement === 'start'}
      labelProps={{
        ...fieldLabelProps,
        ...itemComponentsProps.label,
        ...slots?.label,
        className: cn(
          effectiveLabelPlacement === 'top' ? spacingConfig.label : 'mb-0',
          fieldLabelProps?.className,
          itemComponentsProps.label?.className,
          slots?.label?.className,
        ),
      }}
      description={description}
      descriptionInPopover={
        resolvedDescriptionPlacement === 'popover' && description != null
      }
    />
  );

  const inputElement = (
    <div
      {...itemComponentsProps.inputWrapper}
      {...slots?.inputWrapper}
      className={cn(
        'relative',
        itemComponentsProps.inputWrapper?.className,
        slots?.inputWrapper?.className,
      )}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id,
            'aria-describedby': ariaDescribedBy || undefined,
            'aria-invalid': feedbackStatus === 'error' ? 'true' : undefined,
          } as React.HTMLAttributes<HTMLElement>)
        : children}
    </div>
  );

  const descriptionElement = descriptionRenderedInline ? (
    <p
      {...itemComponentsProps.description}
      {...slots?.description}
      id={descriptionId}
      className={cn(
        'text-muted-foreground text-[0.8rem]',
        spacingConfig.description,
        itemComponentsProps.description?.className,
        slots?.description?.className,
      )}
    >
      {description}
    </p>
  ) : null;

  const contentElement = (
    <>
      {effectiveLabelPlacement === 'top' && labelElement}

      {resolvedDescriptionPlacement === 'top' && descriptionElement}

      {(effectiveLabelPlacement === 'start' || effectiveLabelPlacement === 'end') && (
        <div
          className={cn(
            'flex items-center gap-2',
            effectiveLabelPlacement === 'start' && 'flex-row',
            // effectiveLabelPlacement === 'end' && 'flex-row-reverse',
          )}
        >
          {effectiveLabelPlacement === 'start' && labelElement}
          {inputElement}
          {effectiveLabelPlacement === 'end' && labelElement}
        </div>
      )}

      {effectiveLabelPlacement === 'top' && inputElement}

      {resolvedDescriptionPlacement === 'bottom' && descriptionElement}
    </>
  );

  return (
    <div
      data-slot="form-item"
      {...itemComponentsProps.container}
      {...slots?.container}
      {...props}
      className={cn(
        'flex flex-col ',
        className,
        itemComponentsProps.container?.className,
        slots?.container?.className,
      )}
    >
      {contentElement}

      {Boolean(feedbackText) && (
        <p
          {...itemComponentsProps.error}
          {...slots?.error}
          id={feedbackId}
          className={cn(
            'text-[0.8rem]',
            spacingConfig.feedback,
            feedbackStatus === 'error' && 'text-destructive font-medium',
            feedbackStatus === 'warning' && 'text-amber-600',
            feedbackStatus === 'success' && 'text-green-600',
            itemComponentsProps.error?.className,
            slots?.error?.className,
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
