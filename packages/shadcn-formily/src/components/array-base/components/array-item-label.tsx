import { observer, useField } from '@formily/react';
import React from 'react';
import { useLabel } from '../../../hooks';
import { useIndex } from '../array-context';

export interface ArrayItemLabelProps {}

export const ArrayItemLabel: React.FC<ArrayItemLabelProps> = observer(() => {
  const index = useIndex();
  const label = useLabel();

  const field = useField();

  const itemField = field.query(`${field.address.toString()}.${index}`).take();

  // Use the item field's title if it exists, otherwise fall back to label
  // eslint-disable-next-line ts/no-unsafe-assignment
  const displayLabel = itemField?.title ?? label;

  // Only show index if using the fallback label (not custom title)
  const showIndex = itemField?.title == null;

  const indexSuffix =
    showIndex && (typeof displayLabel === 'string' || displayLabel == null)
      ? ` ${(index ?? 0) + 1}`
      : '';

  const fullLabel = `${displayLabel}${indexSuffix}`;

  return (
    <span className="truncate font-medium block max-w-full text-left" title={fullLabel}>
      {displayLabel}
      {indexSuffix}
    </span>
  );
});
