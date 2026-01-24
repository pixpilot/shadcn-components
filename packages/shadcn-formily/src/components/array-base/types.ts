import type { ButtonProps } from '@pixpilot/shadcn-ui';
import type { IArrayBaseContext } from './array-context';

import type { ArrayBaseComponents } from './components/types';

export interface ActionContext {
  index: number;
  record: unknown;
  array: IArrayBaseContext;
  itemField: unknown;
}

export interface TransformContext extends ActionContext {}

export type BuiltInOperation = 'up' | 'down' | 'copy' | 'edit' | 'remove';

export interface OperationOverride {
  type: BuiltInOperation;
  icon?: React.ReactNode;
  tooltip?: string;
  onClick?: (context: ActionContext) => void;
  hidden?: boolean | ((context: ActionContext) => boolean);
  disabled?: boolean | ((context: ActionContext) => boolean);
}

export interface CustomAction {
  /** Stable key for React rendering and transforms. */
  key: string;
  type?: 'button';
  icon: React.ReactNode;
  tooltip?: string;
  onClick: (ctx: ActionContext) => void;
  hidden?: boolean | ((ctx: ActionContext) => boolean);
  disabled?: boolean | ((ctx: ActionContext) => boolean);
  buttonProps?: Omit<ButtonProps, 'children' | 'onClick'>;
}

export interface ToggleAction {
  type: 'toggle';
  key: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  activeTooltip?: string;
  inactiveTooltip?: string;
  tooltip?: string;
  isActive: (ctx: ActionContext) => boolean;
  onToggle: (ctx: ActionContext, nextActive: boolean) => void;
  hidden?: boolean | ((ctx: ActionContext) => boolean);
  disabled?: boolean | ((ctx: ActionContext) => boolean);
  buttonProps?: Omit<ButtonProps, 'children' | 'onClick'>;
}

export type ActionItem =
  | BuiltInOperation
  | CustomAction
  | ToggleAction
  | OperationOverride;

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

  /**
   * Unified item actions.
   * - Use built-in operation strings ('up' | 'down' | 'copy' | 'remove')
   * - Or custom/toggle actions.
   * - Set to false to disable all actions (including global defaults).
   */
  actions?: ActionItem[] | false;

  /**
   * Optional transform hook applied after merging global + local actions.
   * Runs per item render (context includes index/record/etc).
   */
  transformActions?: (actions: ActionItem[], context: TransformContext) => ActionItem[];
}

export interface IArrayBaseOperationProps extends ButtonProps {
  title?: string;
  index?: number;
  icon?: React.ReactNode;
}

export type ComposedArrayProps<T = Record<string, unknown>> = React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & IArrayBaseProps & T>
> &
  ArrayBaseMixins;

export interface ArrayComponentProps extends React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> &
    IArrayBaseProps & {
      title?: string;
    }
> {}

export interface ArrayItemProps {
  index: number;
  title?: string;
  record?: Record<string, any>;
}
