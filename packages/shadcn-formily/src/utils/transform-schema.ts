/* eslint-disable no-param-reassign */
import type { ISchema } from '@formily/react';
import traverse from 'json-schema-traverse';

interface InputSchemaMap {
  [key: string]: {
    'x-component': string;
    'x-decorator'?: string;
  };
}

const inputSchemaMap: InputSchemaMap = {
  string: {
    'x-component': 'Input',
    'x-decorator': 'FormItem',
  },
  number: {
    'x-component': 'NumberInput',
    'x-decorator': 'FormItem',
  },
  integer: {
    'x-component': 'NumberInput',
    'x-decorator': 'FormItem',
  },
  boolean: {
    'x-component': 'Checkbox',
    'x-decorator': 'FormItem',
  },
  array: {
    'x-component': 'ArrayCards',
    'x-decorator': 'FormItem',
  },
  object: {
    'x-component': 'ObjectContainer',
  },
};

export function transformSchema(
  schema: ISchema,
  fieldsDecorators?: Record<string, string | undefined>,
): ISchema {
  // IMPORTANT: don't mutate the input schema in-place.
  // In Next.js dev (React StrictMode) components may render more than once,
  // and mutating shared schema objects can cause server/client markup to diverge.
  let normalizedSchema: ISchema;
  try {
    normalizedSchema = (
      typeof structuredClone === 'function'
        ? structuredClone(schema)
        : JSON.parse(JSON.stringify(schema))
    ) as ISchema;
  } catch {
    // Fallback to JSON clone if structuredClone fails (e.g., due to functions)
    normalizedSchema = JSON.parse(JSON.stringify(schema)) as ISchema;
  }
  traverse(normalizedSchema, {
    allKeys: true,
    cb: (currentSchema) => {
      const { type } = currentSchema;
      const xComponent = currentSchema['x-component'] as string | undefined;

      // WORKAROUND FOR FORMILY LIMITATION:
      // Formily's core JSON Schema handling does NOT automatically propagate
      // object-level `required: ['fieldName']` to child field validation.
      // While @formily/react-schema-renderer has a fix (PR #928), we don't use that layer.
      // See: https://github.com/alibaba/formily/issues/853
      //      https://github.com/alibaba/formily/pull/928
      // This manually converts `required: ['x']` → `properties.x.required = true`
      // so Formily field validation enforces it.
      // See also: packages/shadcn-formily/FORMILY_LIMITATIONS.md
      if (type === 'object') {
        const requiredKeys = Array.isArray(currentSchema.required)
          ? (currentSchema.required as string[])
          : [];
        if (requiredKeys.length > 0 && currentSchema.properties != null) {
          requiredKeys.forEach((key) => {
            const propertySchema = (
              currentSchema.properties as Record<string, ISchema>
            )?.[key] as ISchema | undefined;
            if (propertySchema && propertySchema.required !== true) {
              propertySchema.required = true;
            }
          });
        }
      }

      if (typeof type === 'string' && type in inputSchemaMap) {
        const mapping = inputSchemaMap[type]!;
        if (currentSchema['x-component'] == null) {
          currentSchema['x-component'] = mapping['x-component'];
        }
      }

      // Apply decorator with priority: existing > user-provided > type mapping > nothing
      if (!['Hidden', 'hidden'].includes(currentSchema['x-component'] as string)) {
        if (currentSchema['x-decorator'] == null) {
          // Check if user provided a decorator for this component
          const userDecorator =
            xComponent != null &&
            fieldsDecorators != null &&
            fieldsDecorators[xComponent] != null
              ? fieldsDecorators[xComponent]
              : null;

          if (userDecorator != null) {
            // Use user-provided decorator
            currentSchema['x-decorator'] = userDecorator;
          } else if (typeof type === 'string' && type in inputSchemaMap) {
            // Fall back to type mapping decorator
            const mapping = inputSchemaMap[type]!;
            currentSchema['x-decorator'] = mapping['x-decorator'];
          }
        }
      }
    },
  });

  return normalizedSchema;
}
