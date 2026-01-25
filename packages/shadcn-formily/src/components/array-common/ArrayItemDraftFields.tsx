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
  basePath?: string;
  as?: React.ElementType;
  className?: string;
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

export function ArrayItemDraftFields({
  schema,
  form,
  basePath = 'draft',
  as: Component = 'div',
  className,
}: ArrayItemDraftFieldsProps) {
  // FormProvider uses ContextCleaner which resets schema-related contexts.
  // We capture the current SchemaField contexts (including user custom components)
  // and re-provide them inside the draft form so string components like "Input"
  // resolve correctly.
  const schemaComponents = React.use(SchemaComponentsContext);
  const schemaOptions = React.use(SchemaOptionsContext);
  const schemaExpressionScope = React.use(SchemaExpressionScopeContext) as unknown;
  const schemaMarkup = React.use(SchemaMarkupContext);
  const schemaContext = React.use(SchemaContext);

  const itemWrapperProps = getXComponentProps(schema);
  const { className: itemWrapperClassName, ...itemWrapperRestProps } = itemWrapperProps;

  return (
    <Component
      {...itemWrapperRestProps}
      className={mergeClassName(className, itemWrapperClassName)}
    >
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
    </Component>
  );
}
