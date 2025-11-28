import type { Schema } from '@formily/react';

type VisitFn = (schema: Schema, path: string[]) => boolean | void | undefined;

type SchemaWithCombinators = Schema & {
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
};

export function forEachSchema(schema: Schema, visit: VisitFn, path: string[] = []): void {
  const shouldContinue = visit(schema, path);
  if (shouldContinue === false) {
    return; // Stop at this node and don't traverse children
  }

  // Traverse object properties
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, propSchema]) => {
      forEachSchema(propSchema, visit, [...path, key]);
    });
  }

  // Traverse array items
  if (schema.type === 'array' && schema.items) {
    forEachSchema(schema.items as Schema, visit, [...path, 'items']);
  }

  // Traverse anyOf, oneOf, allOf
  const schemaWithCombinators = schema as SchemaWithCombinators;
  (['anyOf', 'oneOf', 'allOf'] as const).forEach((key) => {
    const schemas = schemaWithCombinators[key];
    if (schemas) {
      schemas.forEach((subSchema: Schema, index: number) => {
        forEachSchema(subSchema, visit, [...path, key, String(index)]);
      });
    }
  });
}
