import type { SyncReactNode } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@pixpilot/shadcn';
import { useDescription, useFormContext, useLabel } from '../hooks';

import { resolveResponsiveGapClass } from '../utils/resolve-responsive-space';
import { FormItemContainer } from './form-items-container';

export interface ObjectContainerProps extends React.ComponentProps<'div'> {
  label?: SyncReactNode;
  description?: SyncReactNode;
}

export const ObjectContainer: React.FC<ObjectContainerProps> = ({
  className,
  children,
  label,
  description,
  ...rest
}) => {
  const effectiveLabel = useLabel(label);
  const desc = useDescription(description);

  const { objectContainerProps, density, responsive } = useFormContext();

  const gapClass = resolveResponsiveGapClass({ density, responsive });

  const { className: itemsContainerClassName } = objectContainerProps || {};

  return (
    <Card {...rest} className={cn('bg-transparent', gapClass, className)}>
      {(effectiveLabel != null || desc != null) && (
        <CardHeader>
          {effectiveLabel != null && <CardTitle>{effectiveLabel}</CardTitle>}
          {desc != null && <CardDescription>{desc}</CardDescription>}
        </CardHeader>
      )}
      <FormItemContainer as={CardContent} className={itemsContainerClassName}>
        {children}
      </FormItemContainer>
    </Card>
  );
};
