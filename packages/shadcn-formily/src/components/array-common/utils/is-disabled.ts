import type {
  ActionContext,
  CustomAction,
  OperationOverride,
  ToggleAction,
} from '../../array-base';

/**
 * Determines if an action should be disabled based on the provided disabled property and context.
 */
export function isDisabled(
  disabled:
    | OperationOverride['disabled']
    | CustomAction['disabled']
    | ToggleAction['disabled'],
  ctx: ActionContext & { array?: { props?: { disabled?: boolean } } },
): boolean {
  if (ctx?.array?.props?.disabled) return true;
  if (disabled === undefined) return false;
  return typeof disabled === 'function' ? disabled(ctx) : disabled;
}
