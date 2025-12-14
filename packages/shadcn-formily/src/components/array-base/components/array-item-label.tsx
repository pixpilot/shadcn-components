import { useLabel } from '../../../hooks';
import { useIndex } from '../array-context';

export interface ArrayItemLabelProps {}

export const ArrayItemLabel: React.FC<ArrayItemLabelProps> = () => {
  const index = useIndex();
  const label = useLabel();

  return (
    <span className="font-medium">
      {label}
      {typeof label === 'string' ? ` ${(index ?? 0) + 1}` : ''}
    </span>
  );
};
