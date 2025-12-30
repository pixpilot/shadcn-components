import type { Field, GeneralField } from '@formily/core';
import type { ChangeEvent, ClassAttributes, InputHTMLAttributes } from 'react';

import { useFieldSchema } from '@formily/react';

/**
 * Mapper function for NumberInput props
 */
export function mapNumberInputProps(
  props: ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>,
  inputField: GeneralField,
): ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement> {
  const field = inputField as Field;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const schema = useFieldSchema();
  const min = schema?.minimum;
  const max = schema?.maximum;

  const fieldValue = field.value as unknown;
  const value =
    typeof fieldValue === 'number' || typeof fieldValue === 'string' ? fieldValue : '';

  return {
    min,
    max,
    ...props,
    type: 'number',
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value.trim();

      if (raw === '') {
        field.onInput(undefined).catch(() => {});
        return;
      }

      // Support decimal comma input (e.g. "0,68") while keeping dot as default.
      const normalized = raw.includes('.') ? raw : raw.replace(',', '.');
      const nextValue = Number(normalized);

      // Only commit when we have a valid number; otherwise keep the raw string.
      // This avoids turning temporary input states into NaN.
      if (!Number.isNaN(nextValue)) {
        field.onInput(nextValue).catch(() => {});
      } else {
        field.onInput(raw as unknown as number).catch(() => {});
      }
    },
  };
}
