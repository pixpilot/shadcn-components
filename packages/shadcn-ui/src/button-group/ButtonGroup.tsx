import type { buttonGroupVariants as shadcnButtonGroupVariants } from '@pixpilot/shadcn';
import type { VariantProps } from 'class-variance-authority';

import {
  ButtonGroup as ShadcnButtonGroup,
  ButtonGroupSeparator as ShadcnButtonGroupSeparator,
  ButtonGroupText as ShadcnButtonGroupText,
} from '@pixpilot/shadcn';
import * as React from 'react';

export type ButtonGroupProps = React.ComponentProps<'div'> &
  VariantProps<typeof shadcnButtonGroupVariants>;

/**
 * A simple container component that groups buttons together visually.
 * Renders child Button components with proper styling to create a cohesive button group.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="outline">First</Button>
 *   <Button variant="outline">Second</Button>
 *   <Button variant="outline">Third</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ orientation, ...props }, ref) => {
    return <ShadcnButtonGroup ref={ref} orientation={orientation} {...props} />;
  },
);

ButtonGroup.displayName = 'ButtonGroup';

export const ButtonGroupSeparator = ShadcnButtonGroupSeparator;
export const ButtonGroupText = ShadcnButtonGroupText;
