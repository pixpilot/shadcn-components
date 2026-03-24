import type { Form as IForm } from '@formily/core';
import type { Schema } from '@formily/react';

import {
  FormProvider,
  RecursionField,
  SchemaComponentsContext,
  SchemaContext,
  SchemaExpressionScopeContext,
  SchemaMarkupContext,
  SchemaOptionsContext,
} from '@formily/react';
import React from 'react';

import { getXComponentProps } from '../../utils';

export interface ArrayItemDraftFieldsProps {
  schema: Schema;
  form: IForm;
  basePath?: string | number;
  as?: React.ElementType;
  className?: string;
  /**
   * When true (default) the fields are rendered inside an isolated
   * FormProvider so changes don't touch the parent form until saved.
   * When false (autoSave mode) fields are rendered directly in the
   * parent form context so that parent form effects such as
   * onFieldInputValueChange and onFieldValueChange fire normally.
   */
  isolated?: boolean;
}

function mergeClassName(a?: string, b?: string) {
  const aa = a?.trim();
  const bb = b?.trim();

  const hasA = aa != null && aa.length > 0;
  const hasB = bb != null && bb.length > 0;

  if (!hasA && !hasB) return undefined;
  if (hasA && !hasB) return aa;
  if (!hasA && hasB) return bb;
  return `${aa} ${bb}`;
}

interface IsolatedDraftFieldsProps {
  schema: Schema;
  form: IForm;
  basePath: string | number;
}

/**
 * Renders item fields inside their own FormProvider.
 * SchemaField contexts (component registry, options, …) are captured from
 * the outer tree and re-provided inside the new form context so that string
 * component names like "Input" still resolve correctly.
 */
function IsolatedDraftFields({ schema, form, basePath }: IsolatedDraftFieldsProps) {
  const schemaComponents = React.use(SchemaComponentsContext);
  const schemaOptions = React.use(SchemaOptionsContext);
  const schemaExpressionScope = React.use(SchemaExpressionScopeContext) as unknown;
  const schemaMarkup = React.use(SchemaMarkupContext);
  const schemaContext = React.use(SchemaContext);

  return (
    <FormProvider form={form}>
      <SchemaOptionsContext value={schemaOptions}>
        <SchemaComponentsContext value={schemaComponents}>
          <SchemaExpressionScopeContext value={schemaExpressionScope}>
            <SchemaMarkupContext value={schemaMarkup}>
              <SchemaContext value={schemaContext}>
                <RecursionField schema={schema} name={basePath} />
              </SchemaContext>
            </SchemaMarkupContext>
          </SchemaExpressionScopeContext>
        </SchemaComponentsContext>
      </SchemaOptionsContext>
    </FormProvider>
  );
}

export function ArrayItemDraftFields({
  schema,
  form,
  basePath = 'draft',
  as: Component = 'div',
  className,
  isolated = true,
}: ArrayItemDraftFieldsProps) {
  const itemWrapperProps = getXComponentProps(schema);
  const { className: itemWrapperClassName, ...itemWrapperRestProps } = itemWrapperProps;

  return (
    <Component
      {...itemWrapperRestProps}
      className={mergeClassName(className, itemWrapperClassName)}
    >
      {isolated ? (
        <IsolatedDraftFields schema={schema} form={form} basePath={basePath} />
      ) : (
        /*
         * Non-isolated (autoSave) mode: render directly in the current parent
         * form context. The RecursionField `name` is the numeric item index so
         * the fields are created at the correct address (e.g. contacts.0.name)
         * and all parent-form effects fire as expected.
         */
        <RecursionField schema={schema} name={basePath} />
      )}
    </Component>
  );
}
