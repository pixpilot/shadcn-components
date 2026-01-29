import type { Field } from '@formily/core';

export type FieldOptionValue = string | number;

export interface FieldOption {
  value: FieldOptionValue;
  label: unknown;
  disabled?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFieldOption(value: unknown): value is FieldOption {
  if (!isRecord(value)) return false;

  const optionValue = value.value;
  return (
    (typeof optionValue === 'string' || typeof optionValue === 'number') &&
    'label' in value
  );
}

function isFieldOptionArray(value: unknown): value is FieldOption[] {
  return Array.isArray(value) && value.every(isFieldOption);
}

function normalizeEnumToOptions(value: unknown): FieldOption[] | undefined {
  if (!Array.isArray(value)) return undefined;

  if (isFieldOptionArray(value)) {
    return value;
  }

  if (value.every((item) => typeof item === 'string' || typeof item === 'number')) {
    return value.map((item) => ({ value: item, label: String(item) }));
  }

  if (value.every((item) => isRecord(item) && 'value' in item)) {
    const options: FieldOption[] = [];

    value.forEach((item) => {
      const record = item as Record<string, unknown>;
      const optionValue = record.value;

      if (typeof optionValue !== 'string' && typeof optionValue !== 'number') {
        return;
      }

      const optionLabel = 'label' in record ? record.label : String(optionValue);
      const disabled = typeof record.disabled === 'boolean' ? record.disabled : undefined;

      options.push({
        value: optionValue,
        label: optionLabel,
        ...(disabled !== undefined ? { disabled } : null),
      });
    });

    return options;
  }

  return undefined;
}

function getEnumFromField(field: unknown): unknown {
  if (!isRecord(field)) return undefined;

  const schema = isRecord(field.schema) ? field.schema : undefined;
  const componentProps = isRecord(field.componentProps)
    ? field.componentProps
    : undefined;

  const schemaItems = schema && isRecord(schema.items) ? schema.items : undefined;
  const componentPropsItems =
    componentProps && isRecord(componentProps.items) ? componentProps.items : undefined;

  return (
    schema?.enum ?? schemaItems?.enum ?? componentProps?.enum ?? componentPropsItems?.enum
  );
}

function getEnumFromSchema(schema: unknown): unknown {
  if (!isRecord(schema)) return undefined;

  // For array schemas, `items` can be a schema or an array of schemas (tuple).
  // Follow the pattern used by other array helpers and pick the first schema.
  const rawItems = schema.items;
  // eslint-disable-next-line ts/no-unsafe-assignment
  const items = Array.isArray(rawItems) ? (rawItems[0] ?? rawItems) : rawItems;

  const schemaItems = isRecord(items) ? items : undefined;

  return schema.enum ?? schemaItems?.enum;
}

/**
 * Resolve field options the same way as the current Select wrapper:
 * 1) Prefer `field.componentProps.options`
 * 2) Fall back to passed-in `options` (often mapped from Formily `dataSource`)
 *
 * Additionally, we support schema `enum` (including `items.enum` for arrays)
 * and normalize primitive enums to `{ label, value }` options.
 */
export function resolveFieldOptions(args: {
  field?: Field | unknown;
  schema?: unknown;
  options?: unknown;
}): FieldOption[] | undefined {
  const fieldOptions =
    isRecord(args.field) && isRecord(args.field.componentProps)
      ? args.field.componentProps.options
      : undefined;

  if (isFieldOptionArray(fieldOptions)) {
    return fieldOptions;
  }

  if (isFieldOptionArray(args.options)) {
    return args.options;
  }

  const enumValue =
    args.schema !== undefined ? getEnumFromSchema(args.schema) : undefined;
  const fallbackEnumValue = enumValue ?? getEnumFromField(args.field);
  const fromEnum = normalizeEnumToOptions(fallbackEnumValue);
  if (fromEnum && fromEnum.length > 0) {
    return fromEnum;
  }

  return undefined;
}
