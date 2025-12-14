import type { Button } from '@pixpilot/shadcn-ui';
import type { IArrayBaseContext } from './array-context';

import type { ArrayBaseComponents, ArrayOperationTypes } from './components/types';

export interface ArrayBaseMixins extends ArrayBaseComponents {
  useArray: () => IArrayBaseContext | null;
  useIndex: (index?: number) => number | undefined;
  useRecord: (record?: number) => any;
}

export interface IArrayBaseProps {
  disabled?: boolean;
  onAdd?: (index: number) => void;
  onRemove?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onEdit?: (index: number) => void;
  onCopy?: (index: number) => void;
}

export interface IArrayBaseOperationProps extends React.ComponentProps<typeof Button> {
  title?: string;
  index?: number;
  icon?: React.ReactNode;
}

export type ComposedArrayProps<T = Record<string, unknown>> = React.FC<
  React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> &
      IArrayBaseProps & {
        /**
         * Array of operation types to display as default buttons. Set to false to disable all default operations.
         * @default 'MoveDown', 'MoveUp', 'Remove'
         */
        operations?: ArrayOperationTypes[] | false;
      } & T
  >
> &
  ArrayBaseMixins;

export interface ArrayComponentProps extends React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> &
    IArrayBaseProps & {
      operations?: ArrayOperationTypes[] | false;
      title?: string;
    }
> {}

export interface ArrayItemProps {
  index: number;
  title?: string;
  record?: Record<string, any>;
}
