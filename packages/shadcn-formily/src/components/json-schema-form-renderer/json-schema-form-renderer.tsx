import type { FormConfigProps } from '../context';

import type { JsonSchemaFormRendererProps } from './types';
import React, { useMemo } from 'react';
import { useFormSchema } from '../../hooks/use-form-schema';
import { Form } from '.././form';

const JsonSchemaFormRenderer: React.FC<JsonSchemaFormRendererProps> = (props) => {
  const {
    schema,
    children,
    settings: configProp,
    components: componentsProp,
    form,
    ...rest
  } = props;

  const { formSchema, SchemaField } = useFormSchema(schema, componentsProp);

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
