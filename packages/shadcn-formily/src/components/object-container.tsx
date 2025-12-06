import type { SyncReactNode } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@pixpilot/shadcn';
import { useDescription, useLabel } from '../hooks';

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

  return (
    <Card {...rest} className={cn('w-full max-w-sm', className)}>
      {(effectiveLabel != null || desc != null) && (
        <CardHeader>
          {effectiveLabel != null && <CardTitle>{effectiveLabel}</CardTitle>}
          {desc != null && <CardDescription>{desc}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
};
