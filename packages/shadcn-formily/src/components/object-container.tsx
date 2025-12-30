import type { SyncReactNode } from '../types';
import type { SpacingConfig } from '../utils/resolve-responsive-space';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@pixpilot/shadcn';
import { useDescription, useFormContext, useLabel } from '../hooks';

import {
  resolveResponsiveGapClass,
  resolveSpacingClass,
} from '../utils/resolve-responsive-space';
import { FormItemContainer } from './form-items-container';

export interface ObjectContainerProps extends React.ComponentProps<'div'> {
  label?: SyncReactNode;
  description?: SyncReactNode;
}

/**
 * Header gap spacing configuration
 * Uses smaller gaps since headers have less content
 */
const headerConfig: SpacingConfig = {
  fixed: {
    sm: 'gap-1.5 text-lg',
    md: 'gap-2 text-xl',
    lg: 'gap-2.5 text-2xl',
  },
  responsive: 'gap-1.5 text-lg md:gap-2 md:text-xl lg:gap-2.5 lg:text-2xl',
};

/**
 * Card padding spacing configuration
 * Controls vertical padding of the Card component
 */
const cardPaddingConfig: SpacingConfig = {
  fixed: {
    sm: 'py-5',
    md: 'py-6',
    lg: 'py-7',
  },
  responsive: 'py-5 md:py-6 lg:py-7',
};

export const ObjectContainer: React.FC<ObjectContainerProps> = ({
  className,
  children,
  label,
  description,
  ...rest
}) => {
  const effectiveLabel = useLabel(label);
  const desc = useDescription(description);

  const { layout } = useFormContext();
  const { objectContainer, density } = layout || {};

  const gapClass = resolveResponsiveGapClass({ density });
  const headerGapClass = resolveSpacingClass(density, headerConfig);
  const cardPaddingClass = resolveSpacingClass(density, cardPaddingConfig);

  const { classes } = objectContainer || {};

  return (
    <Card
      {...rest}
      slot="form-object-card"
      className={cn(
        'form-object-container',
        'bg-transparent',
        gapClass,
        cardPaddingClass,
        className,
        classes?.card,
      )}
    >
      {(effectiveLabel != null || desc != null) && (
        <CardHeader
          slot="form-object-card"
          className={cn(headerGapClass, classes?.header)}
        >
          {effectiveLabel != null && (
            <CardTitle className={classes?.title}>{effectiveLabel}</CardTitle>
          )}
          {desc != null && (
            <CardDescription className={classes?.description}>{desc}</CardDescription>
          )}
        </CardHeader>
      )}
      <FormItemContainer as={CardContent} className={classes?.content}>
        {children}
      </FormItemContainer>
    </Card>
  );
};
