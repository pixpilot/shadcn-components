import type { ISchema } from '@formily/react';
import traverse from 'json-schema-traverse';

const COMBINATOR_KEYS = ['anyOf', 'oneOf', 'allOf'] as const;

/**
 * Dev-only structural validation for a JSON schema before it reaches Formily.
 *
 * Formily's JSON-schema compiler resolves every field to a concrete field
 * `type` (or an explicit `x-component`). A node that carries a combinator
 * (`anyOf` / `oneOf` / `allOf`) but has **no** top-level `type` and **no**
 * `x-component` cannot be resolved to a field type. Formily then chokes on it
 * inside* `form.validate()` — validation rejects before the submit callback
 * runs, and because it fails inside field-type handling (rather than producing
 * normal field feedback) no error renders on screen. The form silently refuses
 * to submit with no visible reason.
 *
 * A classic source of this is zod v4's `z.toJSONSchema()` on a union such as
 * `z.string().regex(...).or(z.literal(''))`, which emits a typeless `anyOf`
 * node. The fix is to express the intent as a single typed schema (e.g. fold
 * the union into one regex on a plain `z.string()`) so the field keeps a clean
 * `type: 'string'`.
 *
 * Note: a combinator is only flagged when the node has neither `type` nor
 * `x-component`. `{ type: 'string', anyOf: [...] }` or a node with an explicit
 * `x-component` is valid and left alone — so legitimate combinator usage does
 * not trip this check.
 *
 * @param schema - The ISchema to validate
 * @throws {Error} If a typeless, component-less combinator node is found
 *
 * @example
 * validateSchemaShape(schema); // throws on a typeless `anyOf` field node
 */
export function validateSchemaShape(schema: ISchema): void {
  const errors: string[] = [];

  traverse(schema, {
    allKeys: true,
    cb: (currentSchema, jsonPointer) => {
      const current = currentSchema as Record<string, unknown>;

      const hasType = typeof current.type === 'string';
      const hasComponent = typeof current['x-component'] === 'string';

      // A concrete type or an explicit component is enough for Formily to
      // resolve the field; nothing to check on this node.
      if (hasType || hasComponent) return;

      const combinator = COMBINATOR_KEYS.find((key) => {
        const value = current[key];
        return Array.isArray(value) && value.length > 0;
      });

      if (combinator != null) {
        const path = jsonPointer === '' ? '(root)' : jsonPointer;
        errors.push(
          `Node at path '${path}' uses '${combinator}' but has no top-level 'type' or 'x-component'. ` +
            `Formily cannot resolve a field type for it, which makes form.validate() reject silently ` +
            `(no on-screen error, submit callback never runs). ` +
            `Give the node a concrete 'type' (e.g. fold the union into a single typed schema) or an explicit 'x-component'.`,
        );
      }
    },
  });

  if (errors.length > 0) {
    throw new Error(`Schema shape validation failed:\n${errors.join('\n')}`);
  }
}
