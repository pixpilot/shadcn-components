import { cn } from '@pixpilot/shadcn';
import React from 'react';

import { useFormContext } from '../hooks';
import { resolveResponsiveSpaceClass } from '../utils/resolve-responsive-space';

export interface FormItemContainerProps extends React.ComponentProps<'div'> {
  as: React.ElementType;
}

const FormItemContainer: React.FC<FormItemContainerProps> = (props) => {
  const { as: Component = 'div', className, ...rest } = props;

  const { density, responsive } = useFormContext();
  const spaceClass = resolveResponsiveSpaceClass({ density, responsive });

  return <Component {...rest} className={cn(spaceClass, className)} />;
};

FormItemContainer.displayName = 'FormItemContainer';

export { FormItemContainer };
