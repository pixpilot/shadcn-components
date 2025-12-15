import type { ISchema } from '@formily/react';
import type { FormConfigProps } from './context';

import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { isDevelopment } from '@pixpilot/env';
import React, { useMemo } from 'react';
import {
  extractFieldsDecorators,
  transformSchema,
  validateSchemaComponents,
} from '../utils';
import { Form } from './form';
import { schemaFieldBasicComponents } from './schema-field';

export interface JsonSchemaFormRendererProps extends Omit<
  React.ComponentProps<typeof Form>,
  'form'
> {
  schema: ISchema;
  children?: React.ReactNode;
  values?: Record<string, any>;
  components?: {
    fields?: Record<string, { component: React.ComponentType<any>; decorator?: string }>;
    decorators?: Record<string, React.ComponentType<any>>;
  };
}

const JsonSchemaFormRenderer: React.FC<JsonSchemaFormRendererProps> = (props) => {
  const {
    schema,
    children,
    settings: configProp,
    components: componentsProp,
    values,
    ...rest
  } = props;

  const form = useMemo(
    () =>
      createForm({
        values: values || {},
      }),
    [values],
  );

  const formSchema = useMemo(() => {
    // Extract decorator mappings from fields for transformSchema
    const fieldsDecorators = extractFieldsDecorators(componentsProp?.fields);
    return transformSchema(schema, fieldsDecorators);
  }, [schema, componentsProp]);

  const SchemaField = React.useMemo(() => {
    // Merge basic components with user-provided field components
    const mergedComponents: Record<string, React.ComponentType<any>> = {
      ...schemaFieldBasicComponents,
    };

    // Extract component instances from fields
    if (componentsProp?.fields) {
      Object.entries(componentsProp.fields).forEach(([key, field]) => {
        mergedComponents[key] = field.component;
      });
    }

    // Add decorators
    if (componentsProp?.decorators) {
      Object.assign(mergedComponents, componentsProp.decorators);
    }

    if (isDevelopment()) {
      validateSchemaComponents(formSchema, mergedComponents);
    }

    const schemaField = createSchemaField({
      components: mergedComponents,
      scope: {},
    });

    return schemaField;
  }, [formSchema, componentsProp]);

  const config = useMemo((): FormConfigProps => {
    return {
      ...configProp,
      label: {
        useFieldNameAsLabel: true,
        ...(configProp?.label || {}),
      },
    };
  }, [configProp]);

  return (
    <Form {...rest} form={form} settings={config}>
      <SchemaField schema={formSchema} />
      {children}
    </Form>
  );
};

JsonSchemaFormRenderer.displayName = 'JsonSchemaFormRenderer';

export { JsonSchemaFormRenderer };
