import type { ISchema } from '@formily/react';
import traverse from 'json-schema-traverse';

/**
 * Checks if a dotted component reference (e.g., 'ArrayPopover.Addition') exists
 * in the provided components registry.
 *
 * This is necessary because array components use ArrayBase.mixin() to attach
 * subcomponents like Addition, Remove, Item, etc. as properties.
 *
 * @param reference - The dotted component reference (e.g., 'ArrayPopover.Addition')
 * @param components - Record of available React components
 * @returns true if the dotted reference resolves to a valid component
 *
 * @example
 * const components = { ArrayPopover: Object.assign(Component, { Addition: SubComponent }) };
 * hasDottedComponent('ArrayPopover.Addition', components); // true
 * hasDottedComponent('ArrayPopover.NonExistent', components); // false
 */
function hasDottedComponent(
  reference: string,
  components: Record<string, React.ComponentType<any>>,
): boolean {
  const parts = reference.split('.').filter(Boolean);
  // Need at least base and one nested property (e.g., 'ArrayPopover.Addition')
  const MIN_PARTS_FOR_DOTTED = 2;
  if (parts.length < MIN_PARTS_FOR_DOTTED) return false;

  const base = parts[0];
  const path = parts.slice(1);
  if (base == null) return false;
  const baseComponent = components[base];
  if (baseComponent == null) return false;

  let current: unknown = baseComponent;
  for (const key of path) {
    if (current == null) return false;

    // eslint-disable-next-line ts/no-unsafe-member-access
    current = (current as any)[key];
  }

  return current != null;
}

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
        const componentExists =
          componentKeys.includes(xComponent) ||
          hasDottedComponent(xComponent, components);

        if (!componentExists) {
          errors.push(
            `Component '${xComponent}' at path '${jsonPointer}' is not registered in the provided components.`,
          );
        }
      }

      // Validate x-decorator if present - must match a registered component
      if (xDecorator != null && typeof xDecorator === 'string') {
        const decoratorExists =
          componentKeys.includes(xDecorator) ||
          hasDottedComponent(xDecorator, components);

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
