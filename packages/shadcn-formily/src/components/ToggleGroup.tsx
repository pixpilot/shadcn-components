import type { Field } from '@formily/core';
import type { ToggleGroupProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps } from '@formily/react';
import { ToggleGroup as ShadcnToggleGroup, ToggleGroupItem } from '@pixpilot/shadcn-ui';
import * as React from 'react';

import { resolveFieldOptions } from '../utils/resolve-field-options';

type ToggleGroupValue = string | number;

type ToggleGroupVariant = 'default' | 'outline';
type ToggleGroupSize = 'default' | 'sm' | 'lg';

function toVariant(input: unknown): ToggleGroupVariant | undefined {
  return input === 'outline' || input === 'default' ? input : undefined;
}

function toSize(input: unknown): ToggleGroupSize | undefined {
  return input === 'sm' || input === 'lg' || input === 'default' ? input : undefined;
}

function isToggleGroupValue(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

function coerceOptions(options: unknown): ToggleGroupOption[] {
  if (!Array.isArray(options)) {
    return [];
  }

  const coerced = options.map((option): ToggleGroupOption | null => {
    const { value, label, disabled } = option as {
      value?: unknown;
      label?: unknown;
      disabled?: unknown;
    };

    if (!isToggleGroupValue(value)) {
      return null;
    }

    const coercedValue = value as ToggleGroupValue;

    return {
      value: coercedValue,
      label: label as React.ReactNode,
      disabled: Boolean(disabled),
    };
  });

  return coerced.filter((v): v is ToggleGroupOption => v !== null);
}

export interface ToggleGroupOption {
  label: React.ReactNode;
  value: ToggleGroupValue;
  disabled?: boolean;
}

export interface ToggleGroupBaseProps extends Omit<
  ToggleGroupProps,
  'type' | 'value' | 'defaultValue' | 'onValueChange' | 'children' | 'variant' | 'size'
> {
  options: readonly ToggleGroupOption[];
  value?: ToggleGroupValue;
  defaultValue?: ToggleGroupValue;
  onValueChange?: (value: ToggleGroupValue | undefined) => void;
  allowEmptySelection?: boolean;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  buttonClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function ToggleGroupBase({
  options,
  value,
  defaultValue,
  onValueChange,
  allowEmptySelection = false,
  variant = 'outline',
  size,
  buttonClassName,
  ref,
  ...props
}: ToggleGroupBaseProps) {
  const valueString = value === undefined ? undefined : String(value);
  const defaultValueString =
    defaultValue === undefined ? undefined : String(defaultValue);

  const valueByString = React.useMemo(() => {
    const map = new Map<string, ToggleGroupValue>();
    for (const option of options) {
      map.set(String(option.value), option.value);
    }
    return map;
  }, [options]);

  return (
    <ShadcnToggleGroup
      {...props}
      ref={ref}
      type="single"
      value={valueString}
      defaultValue={defaultValueString}
      variant={toVariant(variant)}
      size={toSize(size)}
      onValueChange={(nextValue: string) => {
        if (nextValue === '') {
          if (allowEmptySelection !== true) {
            return;
          }

          onValueChange?.(undefined);
          return;
        }

        onValueChange?.(valueByString.get(nextValue) ?? nextValue);
      }}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={String(option.value)}
          value={String(option.value)}
          aria-label={String(option.value)}
          disabled={option.disabled}
          className={buttonClassName}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ShadcnToggleGroup>
  );
}

/**
 * ToggleGroup component for single selection from a set of options.
 *
 * For multiple selection (array fields), use ArrayToggleGroup instead.
 *
 * Example usage:
 * ```tsx
 * const schema = {
 *   type: 'object',
 *   properties: {
 *     period: {
 *       type: 'string',
 *       title: 'Select period',
 *       enum: [
 *         { label: 'Day', value: 'day' },
 *         { label: 'Week', value: 'week' },
 *         { label: 'Month', value: 'month' },
 *       ],
 *       'x-decorator': 'FormItem',
 *       'x-component': 'ToggleGroup',
 *       'x-component-props': {
 *         allowEmptySelection: false,
 *       },
 *     },
 *   },
 * };
 * ```
 */
export const ToggleGroup = connect(
  ToggleGroupBase,
  mapProps(
    {
      value: true,
      onInput: 'onValueChange',
      dataSource: 'options',
    },
    (props, field) => {
      // eslint-disable-next-line ts/no-unsafe-assignment
      const toggleGroupProps = props as any;
      const fieldValue = (field as Field).value as unknown;

      const resolvedOptions = coerceOptions(
        resolveFieldOptions({
          field,
          options: (props as { options?: unknown }).options,
        }),
      );

      const value: ToggleGroupValue | undefined = isToggleGroupValue(fieldValue)
        ? (fieldValue as ToggleGroupValue)
        : undefined;

      // eslint-disable-next-line ts/no-unsafe-return
      return {
        ...toggleGroupProps,
        options: resolvedOptions,
        value,
        onValueChange: (nextValue: ToggleGroupValue | undefined) => {
          (field as Field).onInput(nextValue).catch(() => {});
        },
      };
    },
  ),
);
