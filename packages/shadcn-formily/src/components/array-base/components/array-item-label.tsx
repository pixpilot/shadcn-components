import { useField } from '@formily/react';
import { useIndex } from '../array-context';

export interface ArrayItemLabelProps {}

export const ArrayItemLabel: React.FC<ArrayItemLabelProps> = () => {
  const index = useIndex();
  const field = useField();
  return (
    <span className="font-medium">
      {field.title} {(index ?? 0) + 1}
    </span>
  );
};
