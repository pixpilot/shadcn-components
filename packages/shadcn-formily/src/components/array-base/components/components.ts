import type { ArrayComponentTypes, ArrayOperationTypes } from './types';
import { ArrayAddition } from './addition';
import { ArrayCopy } from './array-copy';
import { ArrayIndex } from './array-index';
import { ArrayItemLabel } from './array-item-label';
import { ArrayEditButton } from './edit';
import { ArrayEmpty } from './empty';
import { ArrayMoveDown } from './move-down';
import { ArrayMoveUp } from './move-up';
import { ArrayRemove } from './remove';

export const defaultOperationComponents: Record<ArrayOperationTypes, React.FC> = {
  Remove: ArrayRemove,
  Edit: ArrayEditButton,
  Copy: ArrayCopy,
  MoveDown: ArrayMoveDown,
  MoveUp: ArrayMoveUp,
  Label: ArrayItemLabel,
};

export const arrayComponentMap: Record<ArrayComponentTypes, React.FC> = {
  ...defaultOperationComponents,
  Addition: ArrayAddition,
  Empty: ArrayEmpty,
  Index: ArrayIndex,
  Label: ArrayItemLabel,
};
