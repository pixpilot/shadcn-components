import type { Schema } from '@formily/react';
import type {
  ActionContext,
  ActionItem,
  CustomAction,
  OperationOverride,
  ToggleAction,
} from '../array-base';
import type { IArrayBaseContext } from '../array-base/array-context';
import { Button } from '@pixpilot/shadcn-ui';
import React from 'react';
import { RenderBuiltInOperation } from './RenderBuiltInOperation';
import { ToggleActionButton } from './ToggleActionButton';

export interface RenderActionProps {
  action: ActionItem;
  ctx: ActionContext;
  isHidden: (
    hidden: OperationOverride['hidden'] | CustomAction['hidden'] | ToggleAction['hidden'],
    ctx: ActionContext,
  ) => boolean;
  isDisabled: (
    disabled:
      | OperationOverride['disabled']
      | CustomAction['disabled']
      | ToggleAction['disabled'],
    ctx: ActionContext,
  ) => boolean;
  index: number;
  array: IArrayBaseContext;
  schema: Schema;
}

export const RenderAction: React.FC<RenderActionProps> = ({
  action,
  ctx,
  isHidden,
  isDisabled,
  index,
  array,
  schema,
}) => {
  if (typeof action === 'string') {
    return (
      <RenderBuiltInOperation
        operation={action}
        override={undefined}
        ctx={ctx}
        index={index}
        array={array}
        schema={schema}
        isHidden={isHidden}
        isDisabled={isDisabled}
      />
    );
  }

  if (action.type === 'toggle') {
    if (isHidden(action.hidden, ctx)) return null;
    const disabled = isDisabled(action.disabled, ctx);
    return (
      <ToggleActionButton
        key={action.key}
        action={action}
        actionContext={ctx}
        disabled={disabled}
      />
    );
  }

  if (
    action.type === 'up' ||
    action.type === 'down' ||
    action.type === 'copy' ||
    action.type === 'remove' ||
    action.type === 'edit'
  ) {
    return (
      <RenderBuiltInOperation
        operation={action.type}
        override={action}
        ctx={ctx}
        index={index}
        array={array}
        schema={schema}
        isHidden={isHidden}
        isDisabled={isDisabled}
      />
    );
  }

  const customAction = action as CustomAction;
  if (isHidden(customAction.hidden, ctx)) return null;

  const disabled = isDisabled(customAction.disabled, ctx);
  const tooltip = customAction.tooltip ?? customAction.buttonProps?.tooltip;

  return (
    <Button
      key={customAction.key}
      type="button"
      variant="ghost"
      size="icon"
      tooltip={tooltip}
      {...customAction.buttonProps}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) return;
        customAction.onClick?.(e, ctx);
      }}
    >
      {customAction.icon}
    </Button>
  );
};
