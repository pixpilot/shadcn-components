import type { DescriptionPlacement } from './form-item-types';

/*
 * Spacing configuration for form item elements based on description placement.
 * Defines margin classes for label, input, description, and feedback elements
 * to maintain consistent vertical spacing between layout components.
 */
export interface SpacingConfig {
  label: string;
  description: string;
  feedback: string;
}

const FEEDBACK = 'mt-1';
const LABE_DEFAULT = 'mb-2';

export function getSpacingConfig(
  descriptionPlacement: DescriptionPlacement,
  hasDescription: boolean,
): SpacingConfig {
  // When description is on top: label → description → input
  if (descriptionPlacement === 'top' && hasDescription) {
    return {
      label: 'mb-1',
      description: 'mb-1.5',
      feedback: FEEDBACK,
    };
  }

  // When description is on bottom: label → input → description
  if (descriptionPlacement === 'bottom' && hasDescription) {
    return {
      label: LABE_DEFAULT,
      description: 'mt-1',
      feedback: FEEDBACK,
    };
  }

  // When description is in popover or not provided: label → input
  return {
    label: LABE_DEFAULT,
    description: '',
    feedback: FEEDBACK,
  };
}
