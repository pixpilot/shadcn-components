import type { GeneralField } from '@formily/core';

/**
 * Sets default decorator props for Checkbox and Switch components.
 * Ensures slots.label.placement is 'end' and slots.label.className is 'font-normal' if not already set.
 */
export function setCheckboxDefaultDecoratorProps(field: GeneralField): void {
  const slots: Record<string, unknown> =
    (field.decoratorProps.slots as Record<string, unknown> | undefined) ?? {};

  const label: Record<string, unknown> =
    (slots.label as Record<string, unknown> | undefined) ?? {};

  if (label.placement == null) {
    label.placement = 'end';
  }

  if (label.className == null) {
    label.className = 'font-normal';
  }

  slots.label = label;
  // eslint-disable-next-line no-param-reassign
  field.decoratorProps.slots = slots;
}
