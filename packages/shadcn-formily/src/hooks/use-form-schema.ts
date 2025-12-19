import type { ISchema } from '@formily/react';
import type { JsonSchemaFormComponents } from '../components/json-schema-form-renderer/types';
import { useMemo } from 'react';

import { extractFieldsDecorators, transformSchema } from '../utils';
import { useSchemaField } from './use-schema-field';

// eslint-disable-next-line ts/explicit-module-boundary-types
export function useFormSchema(
  schema: ISchema,
  componentsProp: Partial<JsonSchemaFormComponents> | undefined,
) {
  const formSchema = useMemo(() => {
    // Extract decorator mappings from fields for transformSchema
    const fieldsDecorators = extractFieldsDecorators(componentsProp?.fields);
    return transformSchema(schema, fieldsDecorators);
  }, [schema, componentsProp]);

  const SchemaField = useSchemaField(formSchema, componentsProp);

  return { formSchema, SchemaField };
}
