import type { ActionItem, TransformContext } from './types';

export function resolveActions(
  // eslint-disable-next-line ts/default-param-last
  globalActions: ActionItem[] = [],
  localActions: ActionItem[] | false | undefined,
  transformFn:
    | ((actions: ActionItem[], ctx: TransformContext) => ActionItem[])
    | undefined,
  context: TransformContext,
): ActionItem[] {
  if (localActions === false) return [];

  let merged =
    localActions === undefined ? globalActions : [...globalActions, ...localActions];

  if (transformFn) {
    merged = transformFn(merged, context);
  }

  if (context.array.props.transformActions) {
    merged = context.array.props.transformActions(merged, context);
  }

  return merged;
}
