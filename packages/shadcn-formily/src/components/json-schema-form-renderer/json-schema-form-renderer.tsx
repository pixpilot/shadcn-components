import type { FormComponentRecord } from '../../types/form';
import type { FormConfigProps } from '../context';

import type { JsonSchemaFormRendererProps } from './types';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { isDevelopment } from '@pixpilot/env';
import React, { useMemo } from 'react';
import {
  extractFieldsDecorators,
  transformSchema,
  validateSchemaComponents,
} from '../../utils';
import { extractComponents } from '../../utils/extract-components';
import { Form } from '.././form';

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
    // Use only user-provided components (headless approach)
    const componentConfigs: FormComponentRecord = {
      ...componentsProp?.fields,
    };

    // Add decorators as components
    if (componentsProp?.decorators) {
      Object.entries(componentsProp.decorators).forEach(([key, decorator]) => {
        componentConfigs[key] = { component: decorator };
      });
    }

    // Extract component instances
    const components = extractComponents(componentConfigs);

    if (isDevelopment()) {
      validateSchemaComponents(formSchema, components);
    }

    const schemaField = createSchemaField({
      components,
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
