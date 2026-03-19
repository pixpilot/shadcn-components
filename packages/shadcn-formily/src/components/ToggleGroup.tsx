import type { Field } from '@formily/core';
import type { ToggleGroupItemProps, ToggleGroupProps } from '@pixpilot/shadcn-ui';
import { connect, mapProps } from '@formily/react';
import {
  cn,
  ToggleGroup as ShadcnToggleGroup,
  ToggleGroupItem,
} from '@pixpilot/shadcn-ui';
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
  type?: 'single' | 'multiple';
  options: readonly ToggleGroupOption[];
  value?: ToggleGroupValue | ToggleGroupValue[];
  defaultValue?: ToggleGroupValue | ToggleGroupValue[];
  onValueChange?: (value: ToggleGroupValue | undefined | ToggleGroupValue[]) => void;
  allowEmptySelection?: boolean;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  slots: {
    item?: ToggleGroupItemProps;
  };
  ref?: React.Ref<HTMLDivElement>;
  fullWidth?: boolean;
}

export function ToggleGroupBase({
  type = 'single',
  options,
  value,
  defaultValue,
  onValueChange,
  allowEmptySelection = false,
  variant = 'outline',
  size,
  fullWidth = true,
  slots,
  ref,
  ...props
}: ToggleGroupBaseProps) {
  const valueByString = React.useMemo(() => {
    const map = new Map<string, ToggleGroupValue>();
    for (const option of options) {
      map.set(String(option.value), option.value);
    }
    return map;
  }, [options]);

  const sharedProps = {
    ...props,
    className: cn({ 'w-full': fullWidth }, props.className),
    ref,
    variant: toVariant(variant),
    size: toSize(size),
  };

  const itemNodes = options.map((option) => (
    <ToggleGroupItem
      {...slots?.item}
      key={String(option.value)}
      value={String(option.value)}
      aria-label={String(option.value)}
      disabled={option.disabled}
      className={cn(
        {
          'flex-1': fullWidth,
        },
        slots?.item?.className,
      )}
    >
      {option.label}
    </ToggleGroupItem>
  ));

  if (type === 'multiple') {
    let valueStrings: string[] | undefined;
    if (Array.isArray(value)) {
      valueStrings = value.map(String);
    } else if (value !== undefined) {
      valueStrings = [String(value)];
    }

    let defaultValueStrings: string[] | undefined;
    if (Array.isArray(defaultValue)) {
      defaultValueStrings = defaultValue.map(String);
    } else if (defaultValue !== undefined) {
      defaultValueStrings = [String(defaultValue)];
    }

    return (
      <ShadcnToggleGroup
        type="multiple"
        {...sharedProps}
        value={valueStrings}
        defaultValue={defaultValueStrings}
        onValueChange={(nextValues: string[]) => {
          const mapped = nextValues.map((v) => valueByString.get(v) ?? v);
          (onValueChange as ((v: ToggleGroupValue[]) => void) | undefined)?.(mapped);
        }}
      >
        {itemNodes}
      </ShadcnToggleGroup>
    );
  }

  const valueString =
    value === undefined || Array.isArray(value) ? undefined : String(value);
  const defaultValueString =
    defaultValue === undefined || Array.isArray(defaultValue)
      ? undefined
      : String(defaultValue);

  return (
    <ShadcnToggleGroup
      type="single"
      {...sharedProps}
      value={valueString}
      defaultValue={defaultValueString}
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
      {itemNodes}
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

      const isMultiple = (toggleGroupProps as { type?: string }).type === 'multiple';
      let value: ToggleGroupValue | ToggleGroupValue[] | undefined;
      if (isMultiple) {
        value = Array.isArray(fieldValue)
          ? (fieldValue as unknown[]).filter(isToggleGroupValue)
          : [];
      } else if (isToggleGroupValue(fieldValue)) {
        value = fieldValue;
      }

      // eslint-disable-next-line ts/no-unsafe-return
      return {
        ...toggleGroupProps,
        options: resolvedOptions,
        value,
        onValueChange: (nextValue: ToggleGroupValue | undefined | ToggleGroupValue[]) => {
          (field as Field).onInput(nextValue).catch(() => {});
        },
      };
    },
  ),
);
