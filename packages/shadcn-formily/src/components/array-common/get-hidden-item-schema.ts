import type { ISchema } from '@formily/react';

/**
 * Creates a "shallow" version of an array item schema for hidden RecursionField rendering.
 *
 * This prevents mounting all nested field components (like Input) when the array item UI
 * is closed/collapsed, while still creating the array item field instance for x-reactions
 * (e.g., dynamic titles) to work.
 *
 * Used in array components (ArrayDialog, ArrayCollapse) to avoid unnecessary component
 * mounting in list/collapsed states.
 */
export function getHiddenItemSchema(itemSchema: unknown): ISchema | null {
  if (itemSchema == null) return null;

  // Handle Formily Schema objects that may need serialization
  // Schema instances have a toJSON method that returns the plain object representation
  const jsonSchema =
    typeof (itemSchema as { toJSON?: () => unknown }).toJSON === 'function'
      ? (itemSchema as { toJSON: () => unknown }).toJSON()
      : itemSchema;

  if (jsonSchema == null) return null;

  // For non-object schemas (primitives, arrays), return as-is
  if (typeof jsonSchema !== 'object') {
    return jsonSchema as ISchema;
  }

  const objectSchema = jsonSchema as ISchema;

  // For object schemas with properties, create a shallow copy that preserves
  // the schema structure (for field creation and x-reactions) but removes all
  // nested field definitions to prevent component mounting
  if (objectSchema.type === 'object' || objectSchema.properties != null) {
    return {
      ...objectSchema,
      properties: {}, // Empty properties prevents mounting child field components
    } as ISchema;
  }

  return objectSchema;
}
