import type { ArrayField, Form as IForm } from '@formily/core';

import { createForm, onFormValuesChange } from '@formily/core';
import React from 'react';

export interface UseArrayItemDraftFormOptions {
  arrayField: ArrayField;
  index: number | undefined;
  autoSave?: boolean;
  onDraftChange?: (nextValue: unknown) => void;
}

export function useArrayItemDraftForm({
  arrayField,
  index,
  autoSave,
  onDraftChange,
}: UseArrayItemDraftFormOptions): IForm {
  const onDraftChangeRef = React.useRef(onDraftChange);

  React.useEffect(() => {
    onDraftChangeRef.current = onDraftChange;
  }, [onDraftChange]);

  return React.useMemo(() => {
    const arrayValue: unknown = arrayField.value;
    const currentItemValue =
      index != null && Array.isArray(arrayValue)
        ? (arrayValue as unknown[])[index]
        : undefined;

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
  }, [arrayField.value, index, autoSave, onDraftChange]);
}
