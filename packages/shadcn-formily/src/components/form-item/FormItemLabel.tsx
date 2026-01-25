import type { SyncReactNode } from '../../types';
import type { FormItemLabelProps as LabelProps } from './form-item-types';
import { cn } from '@pixpilot/shadcn';

import { FormItemDescriptionPopover } from './FormItemDescriptionPopover';

export interface FormItemLabelProps {
  id: string;
  label: SyncReactNode;
  asterisk?: boolean;
  error?: boolean;
  shrink?: boolean;
  labelProps?: LabelProps;
  description?: SyncReactNode;
  descriptionInPopover?: boolean;
}

export function FormItemLabel({
  id,
  label,
  asterisk,
  error,
  shrink,
  labelProps,
  description,
  descriptionInPopover,
}: FormItemLabelProps) {
  const { className, placement: _placement, ...restLabelProps } = labelProps ?? {};

  return (
    <label
      htmlFor={id}
      data-slot="form-label"
      data-error={Boolean(error)}
      {...restLabelProps}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        shrink && 'shrink-0',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span>{label}</span>
        {descriptionInPopover && description != null && (
          <FormItemDescriptionPopover description={description} />
        )}
      </span>
      {asterisk && (
        <span className="text-destructive ml-1" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}
