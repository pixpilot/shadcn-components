import type { ActionItem } from '../../array-base';

export function hasEditAction(actions: ActionItem[]): boolean {
  return actions.some((action) => {
    if (typeof action === 'string') {
      return action === 'edit';
    }
    if ('type' in action) {
      return action.type === 'edit';
    }
    return false;
  });
}
