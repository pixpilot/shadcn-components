import type { ArrayField, Form as IForm } from '@formily/core';

import { createForm, onFormValuesChange } from '@formily/core';
import React from 'react';

export interface UseArrayItemDraftFormOptions {
  arrayField: ArrayField;
  index: number | undefined;
  autoSave?: boolean;
  onDraftChange?: (nextValue: unknown) => void;
  /**
   * Used when editing a draft-only new item (not yet inserted into arrayField.value).
   * If index is out-of-bounds, this value is used as the initial draft.
   */
  initialDraftValue?: unknown;
}

export function useArrayItemDraftForm({
  arrayField,
  index,
  autoSave,
  onDraftChange,
  initialDraftValue,
}: UseArrayItemDraftFormOptions): IForm {
  const onDraftChangeRef = React.useRef(onDraftChange);

  React.useEffect(() => {
    onDraftChangeRef.current = onDraftChange;
  }, [onDraftChange]);

  return React.useMemo(() => {
    const arrayValue: unknown = arrayField.value;
    const hasArray = Array.isArray(arrayValue);
    const arrayLength = hasArray ? (arrayValue as unknown[]).length : 0;
    const isIndexInBounds =
      index != null && hasArray && index >= 0 && index < arrayLength;

    const currentItemValue = isIndexInBounds
      ? (arrayValue as unknown[])[index]
      : initialDraftValue;

    let didSkipInitial = false;

    return createForm({
      values: {
        draft: currentItemValue,
      },
      effects: () => {
        if (!autoSave || onDraftChange == null) return;

        onFormValuesChange((form) => {
          if (!didSkipInitial) {
            didSkipInitial = true;
            return;
          }
          onDraftChangeRef.current?.((form.values as { draft?: unknown }).draft);
        });
      },
    });
  }, [arrayField.value, index, autoSave, onDraftChange, initialDraftValue]);
}
