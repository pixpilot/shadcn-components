import type { ActionContext, ToggleAction } from '../array-base';

import { Button, cn } from '@pixpilot/shadcn-ui';
import React from 'react';

export const ToggleActionButton: React.FC<{
  action: ToggleAction;
  actionContext: ActionContext;
  disabled: boolean;
}> = ({ action, actionContext, disabled }) => {
  const active = Boolean(action.isActive(actionContext));

  const tooltip = active
    ? (action.activeTooltip ?? action.tooltip ?? action.buttonProps?.tooltip)
    : (action.inactiveTooltip ?? action.tooltip ?? action.buttonProps?.tooltip);

  const iconNode = active ? (action.activeIcon ?? action.icon) : action.icon;

  return (
    <Button
      key={action.key}
      type="button"
      variant="ghost"
      size="icon"
      tooltip={tooltip}
      {...action.buttonProps}
      className={cn(active ? 'text-primary' : undefined, action.buttonProps?.className)}
      disabled={disabled}
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) return;

        action.onClick?.(e, actionContext);

        const nextActive = !active;
        action.onToggle?.(actionContext, nextActive);
      }}
    >
      {iconNode}
    </Button>
  );
};
