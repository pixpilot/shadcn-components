import type { SyncReactNode } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@pixpilot/shadcn';
import { useLabel } from '../hooks';

interface ObjectContainerProps extends React.ComponentProps<'div'> {
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
  return (
    <Card {...rest} className={cn('w-full max-w-sm', className)}>
      {(effectiveLabel != null || description != null) && (
        <CardHeader>
          {effectiveLabel != null && <CardTitle>{effectiveLabel}</CardTitle>}
          {description != null && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
};
