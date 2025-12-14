import type { ISchema } from '@formily/react';
import { createForm } from '@formily/core';
import React, { useMemo } from 'react';
import { transformSchema } from '../utils';
import { Form } from './form';
import { SchemaField } from './schema-field';

export interface JsonSchemaFormRendererProps extends Omit<
  React.ComponentProps<typeof Form>,
  'form'
> {
  schema: ISchema;
  children?: React.ReactNode;
  schemaField?: React.FC<{ schema: ISchema }>;
}

const JsonSchemaFormRenderer: React.FC<JsonSchemaFormRendererProps> = (props) => {
  const { schema, children, schemaField, ...rest } = props;

  const form = useMemo(() => createForm(), []);

  const formSchema = useMemo(() => {
    return transformSchema(schema);
  }, [schema]);

  const SchemaFieldComponent = schemaField || SchemaField;

  return (
    <Form {...rest} form={form}>
      <SchemaFieldComponent schema={formSchema} />
      {children}
    </Form>
  );
};

JsonSchemaFormRenderer.displayName = 'JsonSchemaFormRenderer';

export { JsonSchemaFormRenderer };
