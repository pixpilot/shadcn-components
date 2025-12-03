import type { Form as IForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface IFormProps {
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

  return (
    <FormProvider form={form}>
      <form className={cn('space-y-6', className)} style={style} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  );
}
