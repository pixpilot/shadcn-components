import { useIndex } from '../array-context';

export const ArrayIndex: React.FC = () => {
  const index = useIndex();
  return <span className="font-medium">Item {(index ?? 0) + 1}</span>;
};
