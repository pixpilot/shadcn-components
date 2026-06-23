import type { Form as IForm } from '@formily/core';
import type { FormContextStates, FormContextStatesRequired } from './context';
import { FormProvider } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { FormContextContextProvider } from './context';
import { FormItemContainer } from './FormItemContainer';

export interface IFormProps extends FormContextStates {
  form: IForm;
  id?: string;
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
  id,
  className,
  style,
  children,
  onSubmit,
  onAutoSubmit,
  layout,
  settings,
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
      layout: layout!,
      settings: settings!,
    };
    return sett;
  }, [layout, settings]);

  return (
    <FormContextContextProvider value={formSettings}>
      <FormProvider form={form}>
        <FormItemContainer
          as="form"
          id={id}
          className={cn('flex flex-col', className)}
          style={style}
          onSubmit={handleSubmit}
        >
          {children}
        </FormItemContainer>
      </FormProvider>
    </FormContextContextProvider>
  );
}
