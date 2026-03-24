import type { ArrayField, Form as IForm } from '@formily/core';

import { createForm, onFormValuesChange } from '@formily/core';
import React from 'react';

export interface UseArrayItemDraftFormOptions {
  arrayField: ArrayField;
  index: number | undefined;
  autoSave?: boolean;
  /**
   * @deprecated No longer used. In autoSave mode the parent form is used
   * directly, so changes propagate automatically. In non-autoSave mode
   * changes are only applied on explicit save.
   */
  onDraftChange?: (nextValue: unknown) => void;
  /**
   * Used when editing a draft-only new item (not yet inserted into arrayField.value).
   * If index is out-of-bounds, this value is used as the initial draft.
   */
  initialDraftValue?: unknown;
}

export interface UseArrayItemDraftFormResult {
  /**
   * The form to use for rendering and validation.
   * In autoSave mode this is the parent (array) form so that field-level
   * effects such as onFieldInputValueChange and onFieldValueChange fire as
   * expected. In non-autoSave mode it is an isolated draft form.
   */
  form: IForm;
  /**
   * The name / basePath to pass to RecursionField.
   * - autoSave mode: the numeric item index so fields are created at the
   *   correct address inside the parent form (e.g. contacts.0.name).
   * - non-autoSave mode: the string 'draft' (isolated form root).
   */
  basePath: string | number;
  /**
   * Glob pattern that scopes validate() calls to just the edited item's
   * fields. Undefined in non-autoSave mode (the isolated draft form has
   * only the item's own fields).
   */
  validationPath: string | undefined;
  /**
   * When true the consumer should wrap ArrayItemDraftFields in its own
   * FormProvider (i.e. non-autoSave / isolated). When false, the fields
   * should be rendered directly in the parent form context.
   */
  isolatedForm: boolean;
}

export function useArrayItemDraftForm({
  arrayField,
  index,
  autoSave,
  onDraftChange,
  initialDraftValue,
}: UseArrayItemDraftFormOptions): UseArrayItemDraftFormResult {
  const onDraftChangeRef = React.useRef(onDraftChange);

  React.useEffect(() => {
    onDraftChangeRef.current = onDraftChange;
  }, [onDraftChange]);

  return React.useMemo((): UseArrayItemDraftFormResult => {
    if (autoSave) {
      /*
       * AutoSave mode: render the item fields directly in the parent form
       * context instead of an isolated draft. This ensures that Formily
       * field-level effects registered on the parent form
       * (onFieldInputValueChange, onFieldValueChange, …) fire whenever the
       * user edits a field inside the dialog/popover.
       *
       * Validation is scoped to the item's direct children so that unrelated
       * fields in the parent form are not inadvertently validated on close.
       */
      const basePath: string | number = index ?? 'draft';
      const validationPath =
        index != null ? `${arrayField.address.toString()}.${index}.*` : undefined;

      return {
        form: arrayField.form,
        basePath,
        validationPath,
        isolatedForm: false,
      };
    }

    /*
     * Non-autoSave mode: create an isolated draft form so that the user's
     * in-progress edits do not touch the parent form until they explicitly
     * click Save.
     */
    const arrayValue: unknown = arrayField.value;
    const hasArray = Array.isArray(arrayValue);
    const arrayLength = hasArray ? (arrayValue as unknown[]).length : 0;
    const isIndexInBounds =
      index != null && hasArray && index >= 0 && index < arrayLength;

    const currentItemValue = isIndexInBounds
      ? (arrayValue as unknown[])[index]
      : initialDraftValue;

    let didSkipInitial = false;

    return {
      form: createForm({
        values: {
          draft: currentItemValue,
        },
        effects: () => {
          if (onDraftChangeRef.current == null) return;

          onFormValuesChange((form) => {
            if (!didSkipInitial) {
              didSkipInitial = true;
              return;
            }
            onDraftChangeRef.current?.((form.values as { draft?: unknown }).draft);
          });
        },
      }),
      basePath: 'draft',
      validationPath: undefined,
      isolatedForm: true,
    };
  }, [
    autoSave,
    arrayField.form,
    arrayField.address,
    arrayField.value,
    index,
    initialDraftValue,
  ]);
}
