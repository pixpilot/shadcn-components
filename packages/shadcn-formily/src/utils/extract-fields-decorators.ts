import type React from 'react';

/**
 * Extracts decorator mappings from field configurations.
 *
 * This utility function takes a fields configuration object where each field
 * can optionally define a decorator string, and returns a flat record of
 * field name to decorator mappings.
 *
 * @param fields - The fields configuration with optional decorators
 * @returns Record mapping component names to their decorators
 *
 * @example
 * const fields = {
 *   Input: {
 *     component: InputComponent,
 *     decorator: 'FormItem',
 *   },
 *   CustomInput: {
 *     component: CustomInputComponent,
 *     decorator: 'CustomDecorator',
 *   },
 * };
 *
 * const decorators = extractFieldsDecorators(fields);
 * // Result: { Input: 'FormItem', CustomInput: 'CustomDecorator' }
 */
export function extractFieldsDecorators(
  fields?: Record<string, { component: React.ComponentType<any>; decorator?: string }>,
): Record<string, string | undefined> {
  const fieldsDecorators: Record<string, string | undefined> = {};

  if (fields) {
    Object.entries(fields).forEach(([key, field]) => {
      if (field.decorator != null) {
        fieldsDecorators[key] = field.decorator;
      }
    });
  }

  return fieldsDecorators;
}
