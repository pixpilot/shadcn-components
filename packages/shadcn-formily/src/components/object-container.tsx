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
  slotProps?: {
    card?: React.ComponentProps<typeof Card>;
    header?: React.ComponentProps<typeof CardHeader>;
    title?: React.ComponentProps<typeof CardTitle>;
    description?: React.ComponentProps<typeof CardDescription>;
    content?: React.ComponentProps<typeof CardContent>;
  };
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
  slotProps,
  ...rest
}) => {
  const effectiveLabel = useLabel(label);
  const desc = useDescription(description);

  const { layout } = useFormContext();
  const { objectContainer, density } = layout || {};

  const gapClass = resolveResponsiveGapClass({ density });
  const headerGapClass = resolveSpacingClass(density, headerConfig);
  const cardPaddingClass = resolveSpacingClass(density, cardPaddingConfig);

  const {
    card,
    content,
    description: contextDesc,
    header,
    title,
  } = objectContainer || {};

  const mergedCardProps = {
    ...card,
    ...slotProps?.card,
    className: cn(card?.className, slotProps?.card?.className),
  };
  const mergedHeaderProps = {
    ...header,
    ...slotProps?.header,
    className: cn(header?.className, slotProps?.header?.className),
  };
  const mergedTitleProps = {
    ...title,
    ...slotProps?.title,
    className: cn(title?.className, slotProps?.title?.className),
  };
  const mergedDescProps = {
    ...contextDesc,
    ...slotProps?.description,
    className: cn(contextDesc?.className, slotProps?.description?.className),
  };

  const mergedContentProps = {
    ...content,
    ...slotProps?.content,
    className: cn(content?.className, slotProps?.content?.className),
  };

  return (
    <Card
      {...mergedCardProps}
      {...rest}
      className={cn(
        'form-object-card',
        'bg-transparent',
        gapClass,
        cardPaddingClass,
        className,
        mergedCardProps.className,
      )}
    >
      {(effectiveLabel != null || desc != null) && (
        <CardHeader
          {...mergedHeaderProps}
          className={cn(
            'form-object-header',
            headerGapClass,
            mergedHeaderProps.className,
          )}
        >
          {effectiveLabel != null && (
            <CardTitle
              {...mergedTitleProps}
              className={cn('form-object-title', mergedTitleProps.className)}
            >
              {effectiveLabel}
            </CardTitle>
          )}
          {desc != null && (
            <CardDescription
              {...mergedDescProps}
              className={cn('form-object-desc', mergedDescProps.className)}
            >
              {desc}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <FormItemContainer
        {...mergedContentProps}
        as={CardContent}
        className={cn('form-object-content', mergedContentProps.className)}
      >
        {children}
      </FormItemContainer>
    </Card>
  );
};
