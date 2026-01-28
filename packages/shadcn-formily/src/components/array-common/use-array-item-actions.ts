import type { ActionContext, ActionItem, BuiltInOperation } from '../array-base';

import { useFormConfig } from '../../hooks';
import { useArray, useArrayContext, useRecord } from '../array-base/array-context';
import { DEFAULT_ACTIONS, DEFAULT_ACTIONS_WITH_EDIT } from '../array-base/constants';
import { resolveActions } from '../array-base/resolve-actions';
import { hasEditAction } from './utils/has-edit-action';

export interface UseArrayItemActionsOptions {
  index: number;

  /** Optional record override; defaults to `useRecord()` value. */
  record?: unknown;

  /** When true, ensures an `edit` action exists if `showEditAction` is enabled. */
  ensureEditAction?: boolean;

  /** When true, removes any `edit` action from the resolved list. */
  stripEditAction?: boolean;
}

export interface UseArrayItemActionsResult {
  array: ReturnType<typeof useArray>;
  formConfig: ReturnType<typeof useFormConfig>;
  showEditAction: boolean;
  record: unknown;
  itemField: unknown;
  actionContext: ActionContext | null;
  resolvedActions: ActionItem[];
}

export function useArrayItemActions(
  options: UseArrayItemActionsOptions,
): UseArrayItemActionsResult {
  const { index, record: recordOverride, ensureEditAction, stripEditAction } = options;

  const array = useArray();
  const { showEditAction = false } = useArrayContext();
  const formConfig = useFormConfig();

  const recordFromContext = useRecord() as unknown;
  const record = recordOverride ?? recordFromContext;

  const itemField =
    array?.field?.query(`${array.field.address.toString()}.${index}`).take() ?? null;

  const actionContext: ActionContext | null =
    array != null
      ? {
          index,
          record,
          array,
          itemField,
        }
      : null;

  const defaultActions: BuiltInOperation[] = showEditAction
    ? DEFAULT_ACTIONS_WITH_EDIT
    : DEFAULT_ACTIONS;

  const globalFromSettings = formConfig.array?.item?.actions;
  const localActions = array?.props?.actions;
  const hasLocalActions = Array.isArray(localActions);
  const hasGlobalActions = Array.isArray(globalFromSettings);

  let globalDefaultActions: ActionItem[];
  if (hasLocalActions) {
    globalDefaultActions = [];
  } else if (hasGlobalActions) {
    globalDefaultActions = globalFromSettings;
  } else if (globalFromSettings === false || localActions === false) {
    globalDefaultActions = [];
  } else {
    globalDefaultActions = defaultActions;
  }

  const resolvedActions =
    actionContext != null
      ? resolveActions(
          globalDefaultActions,
          localActions,
          array?.props?.transformActions,
          actionContext,
        )
      : [];

  if (stripEditAction && hasEditAction(resolvedActions)) {
    const editIndex = resolvedActions.findIndex((action) => {
      if (typeof action === 'string') return action === 'edit';
      if ('type' in action) return action.type === 'edit';
      return false;
    });

    if (editIndex >= 0) {
      resolvedActions.splice(editIndex, 1);
    }
  }

  if (ensureEditAction && showEditAction && !hasEditAction(resolvedActions)) {
    resolvedActions.push('edit');
  }

  return {
    array,
    formConfig,
    showEditAction,
    record,
    itemField,
    actionContext,
    resolvedActions,
  };
}
