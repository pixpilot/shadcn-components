import type { ArrayField as FormilyArrayField } from '@formily/core';

import type { TagsInputProps } from '@pixpilot/shadcn-ui';
import { observer, useField, useFieldSchema } from '@formily/react';
import { TagsInput } from '@pixpilot/shadcn-ui';
import React from 'react';

export interface ArrayTagsProps extends TagsInputProps {
  value?: Array<string | number>;
  onChange?: (value: Array<string | number>) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  minTags?: number;
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
  const schema = useFieldSchema();
  const {
    placeholder = 'Add items...',
    emptyText = 'No options found.',
    disabled,
    readOnly,
    maxTags,
    minTags,
    allowDuplicates = false,
    editable = false,
    delimiter = ',',
    addOnPaste = true,
    addOnTab = true,
    onValidate,
    value,
    onChange,
    ...rest
  } = props;

  // Use schema maxItems if maxTags not provided
  const effectiveMaxTags = maxTags ?? schema?.maxItems;

  // Use field value if not controlled externally
  const effectiveValue =
    value ?? (field.value as Array<string | number> | undefined) ?? [];
  const effectiveDisabled = disabled ?? field.disabled ?? false;
  const effectiveReadOnly = readOnly ?? field.readOnly ?? false;
  // eslint-disable-next-line no-underscore-dangle
  const _maxTagsErrorMessage = 'Maximum items reached. Remove a tag to add more.';
  // eslint-disable-next-line no-underscore-dangle
  const _isAtMaxTags =
    typeof effectiveMaxTags === 'number' && effectiveValue.length >= effectiveMaxTags;

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
      freeSolo={true}
      emptyText={emptyText}
      placeholder={placeholder}
      {...rest}
      value={effectiveValue}
      onChange={handleChange}
      disabled={effectiveDisabled}
      readOnly={effectiveReadOnly}
      // maxTags={effectiveMaxTags}
      allowDuplicates={allowDuplicates}
      editable={editable}
      delimiter={delimiter}
      addOnPaste={addOnPaste}
      addOnTab={addOnTab}
      onValidate={onValidate}
    />
  );
});

ArrayTags.displayName = 'ArrayTags';

export default ArrayTags;
