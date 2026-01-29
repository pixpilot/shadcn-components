import type { ArrayField as FormilyArrayField } from '@formily/core';

import type { ToggleGroupProps } from '@pixpilot/shadcn-ui';
import { observer, useField, useFieldSchema } from '@formily/react';
import { ToggleGroup, ToggleGroupItem } from '@pixpilot/shadcn-ui';
import React from 'react';

import { resolveFieldOptions } from '../../utils/resolve-field-options';

type ToggleGroupValue = string | number;

export interface ArrayToggleGroupProps extends Omit<
  ToggleGroupProps,
  'value' | 'onChange' | 'type' | 'defaultValue'
> {
  value?: ToggleGroupValue[];
  onChange?: (value: ToggleGroupValue[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  slots?: {
    button?: {
      className?: string;
    };
  };
  // spacing?: number;
  options?: Array<{
    label: React.ReactNode;
    value: ToggleGroupValue;
    disabled?: boolean;
  }>;
}

function isToggleGroupValue(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

function coerceToggleGroupValueArray(input: unknown): ToggleGroupValue[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter(isToggleGroupValue) as ToggleGroupValue[];
}

/**
 * ArrayToggleGroup component - A multiple-selection toggle group for array fields
 *
 * This component provides a toggle button group interface for managing arrays
 * of primitive values (strings or numbers) with multiple selection support.
 *
 * Features:
 * - Multiple selection (checkbox-style behavior)
 * - Works with schema `type: 'array'` and `items.enum`
 * - Keyboard navigation
 * - Customizable button appearance
 * - Integration with Formily validation
 *
 * Example usage:
 * ```tsx
 * const schema = {
 *   type: 'object',
 *   properties: {
 *     features: {
 *       type: 'array',
 *       title: 'Select features',
 *       items: {
 *         type: 'string',
 *         enum: [
 *           { label: 'Bold', value: 'bold' },
 *           { label: 'Italic', value: 'italic' },
 *           { label: 'Underline', value: 'underline' },
 *         ],
 *       },
 *       'x-decorator': 'FormItem',
 *       'x-component': 'ArrayToggleGroup',
 *       'x-component-props': {
 *         variant: 'outline',
 *         size: 'sm',
 *       },
 *     },
 *   },
 * };
 * ```
 */
export const ArrayToggleGroup = observer((props: ArrayToggleGroupProps) => {
  const field = useField<FormilyArrayField>();
  const schema = useFieldSchema();
  const {
    disabled,
    readOnly,
    slots,
    variant = 'outline',
    value,
    onChange,
    ...rest
  } = props;

  // Resolve options from field schema or props
  const resolvedOptions = React.useMemo(() => {
    return (
      resolveFieldOptions({
        field,
        schema,
        options: props.options,
      }) ?? []
    );
  }, [field, props.options, schema]);

  const toggleOptions = React.useMemo(
    (): Array<{ label: React.ReactNode; value: ToggleGroupValue; disabled?: boolean }> =>
      resolvedOptions.map((option) => ({
        value: option.value,
        label:
          typeof option.label === 'string' || typeof option.label === 'number'
            ? option.label
            : String(option.value),
        disabled: option.disabled,
      })),
    [resolvedOptions],
  );

  const valueByString = React.useMemo(() => {
    const map = new Map<string, ToggleGroupValue>();
    for (const option of toggleOptions) {
      map.set(String(option.value), option.value);
    }
    return map;
  }, [toggleOptions]);

  const effectiveValue = React.useMemo<ToggleGroupValue[]>(
    () => value ?? coerceToggleGroupValueArray(field.value as unknown),
    [field.value, value],
  );
  const effectiveValueString = React.useMemo(
    () => effectiveValue.map(String),
    [effectiveValue],
  );
  const effectiveDisabled = disabled ?? field.disabled ?? false;
  const effectiveReadOnly = readOnly ?? field.readOnly ?? false;

  const handleChange = React.useCallback(
    (newValueStrings: string[]) => {
      const newValue = newValueStrings.map((v) => {
        const mapped = valueByString.get(v);
        return mapped === undefined ? v : mapped;
      });

      if (onChange) {
        onChange(newValue);
        return;
      }

      field.setValue(newValue);
    },
    [field, onChange, valueByString],
  );

  return (
    <ToggleGroup
      {...rest}
      type="multiple"
      value={effectiveValueString}
      onValueChange={handleChange}
      variant={variant}
      disabled={effectiveDisabled || effectiveReadOnly}
    >
      {toggleOptions.map((option) => (
        <ToggleGroupItem
          {...slots?.button}
          key={String(option.value)}
          value={String(option.value)}
          aria-label={String(option.value)}
          disabled={option.disabled}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
});

ArrayToggleGroup.displayName = 'ArrayToggleGroup';

export default ArrayToggleGroup;
