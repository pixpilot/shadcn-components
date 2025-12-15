import type { ISchema } from '@formily/react';
import traverse from 'json-schema-traverse';

/**
 * Validates schema components against the provided React components.
 *
 * For x-component and x-decorator references, they must match a component key
 * in the provided components object.
 *
 * Throws an error if:
 * - An x-component reference doesn't match any available component key
 * - An x-decorator reference doesn't match any available component key
 *
 * @param schema - The ISchema to validate
 * @param components - Record of available React components (includes both components and decorators)
 * @throws {Error} If validation fails
 *
 * @example
 * const components = { Input, NumberInput, Checkbox, FormItem };
 * validateSchemaComponents(schema, components);
 */
export function validateSchemaComponents(
  schema: ISchema,
  components: Record<string, React.ComponentType<any>>,
): void {
  const componentKeys = Object.keys(components);
  const errors: string[] = [];

  traverse(schema, {
    allKeys: true,
    cb: (currentSchema, jsonPointer) => {
      const current = currentSchema as Record<string, unknown>;
      const xComponent = current['x-component'] as string | undefined;
      const xDecorator = current['x-decorator'] as string | undefined;

      // Validate x-component if present - must match a registered component
      if (xComponent != null && typeof xComponent === 'string') {
        const componentExists = componentKeys.includes(xComponent);

        if (!componentExists) {
          errors.push(
            `Component '${xComponent}' at path '${jsonPointer}' is not registered in the provided components.`,
          );
        }
      }

      // Validate x-decorator if present - must match a registered component
      if (xDecorator != null && typeof xDecorator === 'string') {
        const decoratorExists = componentKeys.includes(xDecorator);

        if (!decoratorExists) {
          errors.push(
            `Decorator '${xDecorator}' at path '${jsonPointer}' is not registered in the provided components.`,
          );
        }
      }
    },
  });

  if (errors.length > 0) {
    throw new Error(`Schema validation failed:\n${errors.join('\n')}`);
  }
}
