import type { ArrayField as FormilyArrayField } from '@formily/core';

import { observer, useField } from '@formily/react';
import { TagsInput } from '@pixpilot/shadcn-ui';
import React from 'react';

export interface ArrayTagsProps {
  value?: Array<string | number>;
  onChange?: (value: Array<string | number>) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  editable?: boolean;
  delimiter?: string;
  addOnPaste?: boolean;
  addOnTab?: boolean;
  onValidate?: (value: string) => boolean;
}

/**
 * ArrayTags component - A simple array field for strings/numbers using TagsInput
 *
 * This component provides a tag-based interface for managing simple arrays
 * of primitive values (strings or numbers), unlike other array fields that
 * handle complex object arrays.
 *
 * Features:
 * - Inline tag editing
 * - Keyboard navigation
 * - Paste support with delimiter parsing
 * - Validation support
 * - Max tags limit
 * - Duplicate prevention
 *
 * Example usage:
 * ```tsx
 * const schema = {
 *   type: 'object',
 *   properties: {
 *     tags: {
 *       type: 'array',
 *       title: 'Tags',
 *       'x-decorator': 'FormItem',
 *       'x-component': 'ArrayTags',
 *       'x-component-props': {
 *         placeholder: 'Add tags...',
 *         maxTags: 10,
 *       },
 *     },
 *   },
 * };
 * ```
 */
export const ArrayTags = observer((props: ArrayTagsProps) => {
  const field = useField<FormilyArrayField>();
  const {
    placeholder = 'Add items...',
    emptyText = 'No options found.',
    className,
    disabled,
    readOnly,
    maxTags,
    allowDuplicates = false,
    editable = false,
    delimiter = ',',
    addOnPaste = true,
    addOnTab = true,
    onValidate,
    value,
    onChange,
  } = props;

  // Use field value if not controlled externally
  const effectiveValue =
    value ?? (field.value as Array<string | number> | undefined) ?? [];
  const effectiveDisabled = disabled ?? field.disabled ?? false;
  const effectiveReadOnly = readOnly ?? field.readOnly ?? false;

  const handleChange = React.useCallback(
    (newValue: Array<string | number>) => {
      if (onChange) {
        onChange(newValue);
      } else {
        field.setValue(newValue);
      }
    },
    [field, onChange],
  );

  return (
    <TagsInput
      value={effectiveValue}
      onChange={handleChange}
      placeholder={placeholder}
      emptyText={emptyText}
      className={className}
      disabled={effectiveDisabled}
      readOnly={effectiveReadOnly}
      maxTags={maxTags}
      allowDuplicates={allowDuplicates}
      editable={editable}
      delimiter={delimiter}
      addOnPaste={addOnPaste}
      addOnTab={addOnTab}
      onValidate={onValidate}
      freeSolo={true}
    />
  );
});

ArrayTags.displayName = 'ArrayTags';

export default ArrayTags;
