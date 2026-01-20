import type React from 'react';
import type { DescriptionPlacement, SyncReactNode } from '../../types';

export type LabelPlacement = 'top' | 'bottom' | 'start' | 'end';

export type FormItemLabelProps = Omit<
  React.ComponentPropsWithoutRef<'label'>,
  'children' | 'htmlFor'
> & {
  placement?: LabelPlacement;
};

export interface FormItemSlots {
  label?: FormItemLabelProps;
  description?: React.HTMLAttributes<HTMLParagraphElement>;
  inputWrapper?: React.HTMLAttributes<HTMLDivElement>;
  container?: React.HTMLAttributes<HTMLDivElement>;
  error?: React.HTMLAttributes<HTMLParagraphElement>;
}

export type { DescriptionPlacement };

export interface FormItemProps extends React.ComponentProps<'div'> {
  label?: SyncReactNode;
  description?: SyncReactNode;
  slots?: FormItemSlots;
  /**
   * Controls where `description` is rendered relative to the input.
   * - `top`: above the input
   * - `bottom`: below the input
   * - `popover`: show a help icon before the label and render the description in a hover popover
   */
  descriptionPlacement?: DescriptionPlacement;
  asterisk?: boolean;
  feedbackStatus?: 'error' | 'warning' | 'success';
  feedbackText?: SyncReactNode;
}
