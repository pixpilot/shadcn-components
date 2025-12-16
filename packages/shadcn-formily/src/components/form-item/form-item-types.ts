import type React from 'react';
import type { DescriptionPlacement, SyncReactNode } from '../../types';

export type LabelPlacement = 'top' | 'bottom' | 'start' | 'end';

export type { DescriptionPlacement };

export interface FormItemProps extends React.ComponentProps<'div'> {
  label?: SyncReactNode;
  description?: SyncReactNode;
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
  labelPlacement?: LabelPlacement;
}
