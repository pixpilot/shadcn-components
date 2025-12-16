import type { Form as IForm } from '@formily/core';
import type { FormContextStates, FormContextStatesRequired } from './context';
import { FormProvider } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { FormContextContextProvider } from './context';
import { FormItemContainer } from './form-items-container';

export interface IFormProps extends FormContextStates {
  form: IForm;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onSubmit?: (values: any) => void;
  onAutoSubmit?: (values: any) => void;
}

/**
 * Form component - wraps FormProvider and provides form context
 */
export function Form({
  form,
  className,
  style,
  children,
  onSubmit,
  onAutoSubmit,
  itemProps,
  objectContainer,
  density,
  settings,
  descriptionPlacement,
}: IFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form
      .submit((values) => {
        onSubmit?.(values);
        onAutoSubmit?.(values);
      })
      .catch(() => {
        // Handle submission errors if needed
      });
  };

  const formSettings = React.useMemo(() => {
    const sett: FormContextStatesRequired = {
      itemProps: itemProps!,
      objectContainer: objectContainer!,
      density: density!,
      settings: settings!,
      ...(descriptionPlacement !== undefined ? { descriptionPlacement } : {}),
    };
    return sett;
  }, [itemProps, objectContainer, density, settings, descriptionPlacement]);

  return (
    <FormContextContextProvider value={formSettings}>
      <FormProvider form={form}>
        <FormItemContainer
          as="form"
          className={cn('space-y-6', className)}
          style={style}
          onSubmit={handleSubmit}
        >
          {children}
        </FormItemContainer>
      </FormProvider>
    </FormContextContextProvider>
  );
}
