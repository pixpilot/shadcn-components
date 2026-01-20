# Formily Known Limitations and Workarounds

This document describes known issues/limitations in Formily that we work around in shadcn-formily.

## JSON Schema `required` Array Not Enforced

**Issue**: Formily does not automatically enforce object-level `required: ['fieldName']` arrays from JSON Schema.

### The Problem

In standard JSON Schema, you can specify required fields on an object like this:

```json
{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string" }
  }
}
```

Formily's core JSON Schema implementation **does not** automatically convert this into field-level validation. When you submit/validate, the fields are not marked as required unless you also set `required: true` directly on each property:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "required": true },
    "email": { "type": "string", "required": true }
  }
}
```

### Why This Happens

- Formily's field validation is attached to **fields**, not schema objects
- The `@formily/json-schema` package stores `required` as metadata but doesn't propagate it to child fields
- The `@formily/react-schema-renderer` package **does** have a fix (PR #928), but shadcn-formily doesn't use that renderer layer
- References:
  - Issue: https://github.com/alibaba/formily/issues/853
  - Fix (for renderer only): https://github.com/alibaba/formily/pull/928

### Our Workaround

In `src/utils/transform-schema.ts`, we automatically transform object-level `required` arrays into field-level `required: true`:

```typescript
if (type === 'object') {
  const requiredKeys = Array.isArray(currentSchema.required)
    ? (currentSchema.required as string[])
    : [];
  if (requiredKeys.length > 0 && currentSchema.properties != null) {
    requiredKeys.forEach((key) => {
      const propertySchema = currentSchema.properties[key];
      if (propertySchema && propertySchema.required !== true) {
        propertySchema.required = true;
      }
    });
  }
}
```

This ensures:

- ArrayPopover validation blocks closing when required fields are empty
- Form submission blocks when required fields are missing
- Standard JSON Schema `required` arrays work as expected

### Edge Cases Handled

The `transformSchema` workaround safely handles these edge cases:

- **Non-existent properties**: Ignores required keys that don't exist in properties
- **Null/undefined properties**: Skips null property values gracefully
- **Duplicate required entries**: Handles duplicates without error
- **Empty required arrays**: No-op when `required: []`
- **Invalid required values**: Safely ignores non-array `required` values
- **Empty string keys**: Safely ignores `required: ['']`
- **Deeply nested structures**: Works recursively through nested objects and arrays
- **Mixed nesting**: Handles arrays within objects within arrays, etc.
- **Non-object types**: Ignores `required` arrays on non-object types

All edge cases are covered by comprehensive tests in `test/utils/transform-schema.test.ts`.

### When You'll Notice This

- Using `JsonSchemaFormExtended` with `required: ['field']`
- ArrayPopover/ArrayDialog with nested objects and `required` arrays
- Any JSON Schema form where you use object-level `required` instead of field-level `required: true`

### If Validation Isn't Working

1. Check if you're using `JsonSchemaFormExtended` or `transformSchema` - these apply the fix
2. If using raw `createSchemaField` + plain schemas, you must either:
   - Manually set `required: true` on each field property, OR
   - Call `transformSchema(yourSchema)` before passing to `SchemaField`
3. Verify the field has `x-decorator: 'FormItem'` so validation errors display

---

**Last Updated**: January 2026
