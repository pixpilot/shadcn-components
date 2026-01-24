import type {
  ActionContext,
  CustomAction,
  OperationOverride,
  ToggleAction,
} from '../../array-base';

/**
 * Determines if an action should be hidden based on the provided hidden property and context.
 */
export function isHidden(
  hidden: OperationOverride['hidden'] | CustomAction['hidden'] | ToggleAction['hidden'],
  ctx: ActionContext,
): boolean {
  if (hidden === undefined) return false;
  return typeof hidden === 'function' ? hidden(ctx) : hidden;
}
