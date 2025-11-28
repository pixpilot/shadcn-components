/*
  Utility functions for extracting default values from Formily schemas.
  These are used by array-list components and other schema-driven forms.
*/
import type { Schema } from '@formily/react';

export function getSchemaDefaultValue(schema?: Schema): unknown {
  if (!schema) return undefined;
  if (schema.type === 'array') return [];
  if (schema.type === 'object') return {};
  if (schema.type === 'void' && schema.properties) {
    for (const key in schema.properties) {
      if (Object.hasOwn(schema.properties, key)) {
        const value: unknown = getSchemaDefaultValue(schema.properties[key]);
        if (value !== undefined) return value;
      }
    }
  }
  return undefined;
}

export function getDefaultValue(defaultValue: unknown, schema: Schema): unknown {
  if (defaultValue !== undefined) return JSON.parse(JSON.stringify(defaultValue));
  if (Array.isArray(schema?.items)) return getSchemaDefaultValue(schema.items[0]);
  return getSchemaDefaultValue(schema?.items);
}
