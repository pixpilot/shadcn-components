import type { ArrayComponentTypes, ArrayOperationTypes } from './types';
import { ArrayAddition } from './Addition';
import { ArrayCopy } from './ArrayCopy';
import { ArrayIndex } from './ArrayIndex';
import { ArrayItemLabel } from './ArrayItemLabel';
import { ArrayEditButton } from './Edit';
import { ArrayEmpty } from './Empty';
import { ArrayMoveDown } from './MoveDown';
import { ArrayMoveUp } from './MoveUp';
import { ArrayRemove } from './Remove';

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
