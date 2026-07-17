import type { ReactNode } from 'react';
import type { SyncReactNode } from '../../types';
import type { FormItemLabelProps as LabelProps } from './form-item-types';
import { cn } from '@pixpilot/shadcn';

import { FormItemDescriptionPopover } from './FormItemDescriptionPopover';

export interface FormItemLabelProps {
  id?: string;
  /**
   * The id of the form control this label is associated with. Rendered as the
   * `<label>` element's `htmlFor` so clicking the label activates the control.
   */
  htmlFor?: string;
  label: SyncReactNode;
  requiredMark?: boolean | ReactNode;
  /**
   * @deprecated Use `requiredMark` instead.
   */
  asterisk?: boolean;
  error?: boolean;
  shrink?: boolean;
  labelProps?: LabelProps;
  description?: SyncReactNode;
  descriptionInPopover?: boolean;
}

export function FormItemLabel({
  id,
  htmlFor,
  label,
  requiredMark,
  asterisk,
  error,
  shrink,
  labelProps,
  description,
  descriptionInPopover,
}: FormItemLabelProps) {
  const { className, placement: _placement, ...restLabelProps } = labelProps ?? {};
  const resolvedRequiredMark = requiredMark !== undefined ? requiredMark : asterisk;

  return (
    <label
      id={id}
      htmlFor={htmlFor}
      data-slot="form-item-label"
      data-error={Boolean(error)}
      {...restLabelProps}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        shrink && 'shrink-0',
        className,
      )}
    >
      <span
        data-slot="form-item-label-text-container"
        className="inline-flex items-center gap-1"
      >
        <span data-slot="form-item-label-text">{label}</span>
        {descriptionInPopover && description != null && (
          <FormItemDescriptionPopover description={description} />
        )}
      </span>
      {resolvedRequiredMark !== false && resolvedRequiredMark != null && (
        <span
          data-slot="form-item-label-required-mark"
          className="text-destructive ml-1"
          aria-label="required"
        >
          {resolvedRequiredMark === true ? '*' : resolvedRequiredMark}
        </span>
      )}
    </label>
  );
}
