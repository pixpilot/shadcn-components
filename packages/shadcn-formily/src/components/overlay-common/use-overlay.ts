import type { GeneralField } from '@formily/core';
import type { SyncReactNode } from '../../types';
import type { OverlayTriggerProps } from './OverlayTrigger';
import { useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { useDescription, useFormContext, useLabel } from '../../hooks';
import { resolveResponsiveGapClass } from '../../utils/resolve-responsive-space';
import { useShakeAnimation } from '../array-common';
import { DEFAULT_TRIGGER_NOUN } from './constants';
import { isEmptyFieldValue } from './is-empty-field-value';

/**
 * Formily glob matching the field itself and every descendant, and nothing
 * else — `*(a,a.*)` matches `a`, `a.b`, and `a.b.c`, but not the sibling `ab`.
 * One pattern covers both shapes an overlay can hold: a single input (validate
 * the field) and an object's form (validate its fields), at any depth.
 */
function buildValidationPattern(address: string): string {
  return `*(${address},${address}.*)`;
}

export interface UseOverlayOptions {
  label?: SyncReactNode;
  description?: SyncReactNode;
  /**
   * Props for the trigger button. Without `trigger.label` the trigger says
   * `Add <title>` / `Edit <title>` depending on whether the field holds data.
   */
  trigger?: OverlayTriggerProps;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When false, the overlay closes without validating first.
   * Default is true.
   */
  validateOnClose?: boolean;
}

export interface UseOverlayResult {
  label: SyncReactNode | null;
  description: SyncReactNode | null;
  /** Trigger props with `label` resolved: the given label, or the Add/Edit default. */
  trigger: OverlayTriggerProps;
  open: boolean;
  /** Density-aware gap class for the fields rendered inside the overlay. */
  gapClass: string;
  /** True while the field or any of its descendants has a validation error. */
  hasError: boolean;
  /** True while the shake animation should play. */
  shouldShake: boolean;
  /**
   * Handles a Radix `onOpenChange`. Opening is immediate; closing is routed
   * through `requestClose` so invalid fields keep the overlay open.
   */
  handleOpenChange: (next: boolean) => void;
  /**
   * Validates the overlay's fields and closes only if they pass; otherwise
   * shakes the overlay to point the user at the errors.
   */
  requestClose: () => void;
}

/**
 * Shared state for fields that render their input(s) inside an overlay
 * (dialog or popover) opened from a trigger button.
 *
 * Fields render in the parent form (no draft copy), so edits commit as the
 * user types. This mirrors the autoSave mode of ArrayDialog/ArrayPopover:
 * validation on close is scoped to the overlay's own fields so unrelated
 * fields elsewhere in the form are not validated.
 */
export function useOverlay(options: UseOverlayOptions = {}): UseOverlayResult {
  const {
    label,
    description,
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    validateOnClose = true,
  } = options;

  const effectiveLabel = useLabel(label);
  const effectiveDescription = useDescription(description);

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const { layout } = useFormContext();
  const gapClass = resolveResponsiveGapClass({ density: layout?.density });

  // `errors` on an object field aggregates its own and its descendants' errors.
  const field = useField<GeneralField & { errors: unknown[]; value: unknown }>();
  const hasError = field.errors.length > 0;

  const validationPath = buildValidationPattern(field.address.toString());

  const schema = useFieldSchema();
  const noun = (schema.title as string | undefined) ?? DEFAULT_TRIGGER_NOUN;
  /*
   * Reading field.value inside an observer keeps the verb reactive, so the
   * trigger flips to "Edit" as soon as the field holds data. A `trigger.label`
   * from props — including one an x-reaction wrote — wins.
   */
  const isEmpty = isEmptyFieldValue(field.value);
  const resolvedTrigger: OverlayTriggerProps = {
    ...trigger,
    label: trigger?.label ?? (isEmpty ? `Add ${noun}` : `Edit ${noun}`),
  };

  const { shouldShake, triggerShake } = useShakeAnimation();

  /*
   * Re-surface errors when reopening after a failed validation. Inputs are torn
   * down and rebuilt as they move between the hidden container and the overlay,
   * which drops their feedback, so validate once on open to restore it. Only
   * when the field was already known to be invalid — validating an untouched
   * field on open would flag it straight away.
   */
  const revalidateOnOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (!isOpen || !revalidateOnOpenRef.current) return;

    revalidateOnOpenRef.current = false;
    Promise.resolve(field.form.validate(validationPath)).catch(() => undefined);
  }, [field.form, isOpen, validationPath]);

  const requestClose = React.useCallback(() => {
    if (!validateOnClose) {
      setOpen(false);
      return;
    }

    Promise.resolve(field.form.validate(validationPath))
      .then(() => {
        setOpen(false);
      })
      .catch(() => {
        triggerShake();
      });
  }, [field.form, setOpen, triggerShake, validateOnClose, validationPath]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next) {
        revalidateOnOpenRef.current = hasError;
        setOpen(true);
        return;
      }
      requestClose();
    },
    [hasError, requestClose, setOpen],
  );

  return {
    label: effectiveLabel,
    description: effectiveDescription,
    trigger: resolvedTrigger,
    open: isOpen,
    gapClass,
    hasError,
    shouldShake,
    handleOpenChange,
    requestClose,
  };
}
