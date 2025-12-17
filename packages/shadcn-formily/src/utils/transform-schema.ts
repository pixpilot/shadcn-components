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
  const normalizedSchema = (
    typeof structuredClone === 'function'
      ? structuredClone(schema)
      : JSON.parse(JSON.stringify(schema))
  ) as ISchema;
  traverse(normalizedSchema, {
    allKeys: true,
    cb: (currentSchema) => {
      const { type } = currentSchema;
      const xComponent = currentSchema['x-component'] as string | undefined;

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
