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

/**
 * Deep-clone the plain-object/array structure of a schema while keeping any
 * non-plain values (functions, class instances such as TipTap extensions,
 * Dates, etc.) by reference.
 *
 * A plain `JSON.parse(JSON.stringify(...))` clone silently drops function
 * values, which breaks `x-component-props` that carry callbacks (e.g. custom
 * toolbar `onClick` handlers) or class instances (e.g. TipTap `extensions`,
 * whose `parseHTML`/`renderHTML` methods would be stripped). This clone only
 * copies plain objects and arrays — the parts `transformSchema` actually
 * mutates — and leaves everything else untouched.
 */
function cloneSchemaPreservingRefs<T>(value: T): T {
  if (Array.isArray(value)) {
    return (value as unknown[]).map((item) => cloneSchemaPreservingRefs(item)) as T;
  }

  if (value !== null && typeof value === 'object') {
    const proto = Object.getPrototypeOf(value) as object | null;
    // Only deep-clone plain objects. Class instances, Dates, etc. keep their
    // reference so their methods/prototype survive.
    if (proto === Object.prototype || proto === null) {
      const source = value as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(source)) {
        out[key] = cloneSchemaPreservingRefs(source[key]);
      }
      return out as T;
    }
  }

  // Primitives, functions and non-plain objects are returned as-is.
  return value;
}

export function transformSchema(
  schema: ISchema,
  fieldsDecorators?: Record<string, string | undefined>,
): ISchema {
  // IMPORTANT: don't mutate the input schema in-place.
  // In Next.js dev (React StrictMode) components may render more than once,
  // and mutating shared schema objects can cause server/client markup to diverge.
  //
  // We clone the plain schema structure but preserve functions and class
  // instances (e.g. `x-component-props.extensions` TipTap marks/nodes and
  // toolbar `onClick` handlers) by reference — a JSON clone would strip them.
  const normalizedSchema = cloneSchemaPreservingRefs(schema);
  traverse(
    normalizedSchema,
    { allKeys: true },
    (
      currentSchema,
      _jsonPtr,
      _rootSchema,
      _parentJSONPtr,
      parentKeyword,
      _parentSchema,
      _keyIndex,
    ) => {
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
          // Don't set x-component for array items unless explicitly set
          if (parentKeyword !== 'items') {
            currentSchema['x-component'] = mapping['x-component'];
          }
        }
      }

      // Handle enum: if type is string and has enum, use Select component
      if (
        type === 'string' &&
        Array.isArray(currentSchema.enum) &&
        currentSchema.enum.length > 0
      ) {
        if (
          currentSchema['x-component'] == null ||
          currentSchema['x-component'] === 'Input'
        ) {
          currentSchema['x-component'] = 'Select';
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

      // Handle array minItems/maxItems validation
      if (type === 'array') {
        const minItems = currentSchema.minItems as number | undefined;
        // const maxItems = currentSchema.maxItems as number | undefined;

        if (
          typeof minItems === 'number' &&
          minItems > 0 &&
          currentSchema.required !== true
        ) {
          currentSchema.required = true;
        }

        // let xValidator: any[] = currentSchema['x-validator'] as any[];
        // if (!Array.isArray(xValidator)) {
        //   xValidator = [];
        //   currentSchema['x-validator'] = xValidator;
        // }

        // const hasMinItemsValidator = xValidator.some(
        //   (v) => typeof v === 'object' && v !== null && ('minItems' in v || 'min' in v),
        // );
        // const hasMaxItemsValidator = xValidator.some(
        //   (v) => typeof v === 'object' && v !== null && ('maxItems' in v || 'max' in v),
        // );

        // if (minItems != null && !hasMinItemsValidator) {
        //   xValidator.push({
        //     minItems,
        //     message: 'Minimum items required.',
        //   });
        // }

        // if (maxItems != null && !hasMaxItemsValidator) {
        //   xValidator.push({
        //     maxItems,
        //     message: 'Maximum items reached.',
        //   });
        // }
      }
    },
  );

  return normalizedSchema;
}
