import type { SyncReactNode } from '../../types';
import { cn } from '@pixpilot/shadcn';
import React from 'react';

import { FormItemDescriptionPopover } from './form-item-description-popover';

export interface FormItemLabelProps {
  id: string;
  label: SyncReactNode;
  asterisk?: boolean;
  error?: boolean;
  shrink?: boolean;
  labelClassName?: string;
  description?: SyncReactNode;
  descriptionInPopover?: boolean;
}

export function FormItemLabel({
  id,
  label,
  asterisk,
  error,
  shrink,
  labelClassName,
  description,
  descriptionInPopover,
}: FormItemLabelProps) {
  return (
    <label
      htmlFor={id}
      data-slot="form-label"
      data-error={Boolean(error)}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        shrink && 'shrink-0',
        labelClassName,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {descriptionInPopover && description != null && (
          <FormItemDescriptionPopover description={description} />
        )}
        <span>{label}</span>
      </span>
      {asterisk && (
        <span className="text-destructive ml-1" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}
