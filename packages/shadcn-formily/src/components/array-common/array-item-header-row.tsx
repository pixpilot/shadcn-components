import type { Schema } from '@formily/react';
import type {
  ActionContext,
  ActionItem,
  BuiltInOperation,
  CustomAction,
  OperationOverride,
  ToggleAction,
} from '../array-base';
import { RecursionField } from '@formily/react';
import { Button, cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { useFormConfig } from '../../hooks';
import { ArrayBase, resolveActions, useArrayComponents } from '../array-base';
import { useArray, useArrayContext, useRecord } from '../array-base/array-context';
import { DEFAULT_ACTIONS, DEFAULT_ACTIONS_WITH_EDIT } from '../array-base/constants';
import {
  isCopyComponent,
  isEditComponent,
  isIndexComponent,
  isMoveDownComponent,
  isMoveUpComponent,
  isRemoveComponent,
} from '../array-base/utils/is-array-component';
import { hasEditAction } from './utils';

const ToggleActionButton: React.FC<{
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

        const nextActive = !active;
        action.onToggle(actionContext, nextActive);
      }}
    >
      {iconNode}
    </Button>
  );
};

export interface ArrayItemHeaderRowProps {
  schema: Schema;
  index: number;

  /** Outer container classes */
  className?: string;

  /** Classes applied to the left (label) container */
  contentClassName?: string;

  /** Classes applied to the right (operations) container */
  operationsClassName?: string;

  /** Optional element rendered before the label (e.g., chevron icon) */
  leading?: React.ReactNode;

  /** Override the default label rendering */
  label?: React.ReactNode;

  /** Override the default operations rendering */
  operations?: React.ReactNode;

  /**
   * If provided, renders the label area as a button.
   * Useful for collapse/accordion headers.
   */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;

  /** Render operations column (defaults to true) */
  showOperations?: boolean;
}

export const ArrayItemHeaderRow: React.FC<ArrayItemHeaderRowProps> = React.memo(
  ({
    schema,
    index,
    className,
    contentClassName,
    operationsClassName,
    leading,
    label,
    operations,
    buttonProps,
    showOperations = true,
  }) => {
    const { ItemLabel } = useArrayComponents();
    const { showEditAction } = useArrayContext();

    const array = useArray();
    const record = useRecord() as unknown;
    const formConfig = useFormConfig();

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

    const isHidden = (
      hidden:
        | OperationOverride['hidden']
        | CustomAction['hidden']
        | ToggleAction['hidden'],
      ctx: ActionContext,
    ) => {
      if (hidden === undefined) return false;
      return typeof hidden === 'function' ? hidden(ctx) : hidden;
    };

    const isDisabled = (
      disabled:
        | OperationOverride['disabled']
        | CustomAction['disabled']
        | ToggleAction['disabled'],
      ctx: ActionContext,
    ) => {
      if (array?.props?.disabled) return true;
      if (disabled === undefined) return false;
      return typeof disabled === 'function' ? disabled(ctx) : disabled;
    };

    const renderBuiltInOperation = (
      operation: BuiltInOperation,
      override: OperationOverride | undefined,
      ctx: ActionContext,
    ) => {
      const hidden = override ? isHidden(override.hidden, ctx) : false;
      if (hidden) return null;

      const disabled = override ? isDisabled(override.disabled, ctx) : false;
      const tooltip = override?.tooltip;
      const icon = override?.icon;

      const onClick =
        override?.onClick != null
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              override.onClick?.(ctx);
              // Prevent built-in default behavior when overridden.
              e.preventDefault();
            }
          : undefined;

      const commonProps = {
        index,
        tooltip,
        icon,
        disabled,
        onClick,
      };

      const schemaHasMatchingOperation = (check: (schema: any) => boolean) => {
        const props = (
          schema as unknown as { properties?: Record<string, unknown> } | null
        )?.properties;
        if (props == null) return false;
        for (const value of Object.values(props)) {
          if (check(value)) return true;
        }
        return false;
      };

      const renderSchemaOperation = (check: (schema: any) => boolean) => {
        if (array?.field == null) return null;
        return (
          <RecursionField
            basePath={array.field.address}
            schema={schema}
            name={index}
            filterProperties={check}
            onlyRenderProperties
          />
        );
      };

      // If schema defines the operation component (e.g. custom icon via x-component-props),
      // prefer it over the built-in default rendering.
      // Explicit ActionItem overrides still win.
      if (override == null) {
        switch (operation) {
          case 'up':
            if (schemaHasMatchingOperation(isMoveUpComponent)) {
              return (
                <React.Fragment key="op-up-schema">
                  {renderSchemaOperation(isMoveUpComponent)}
                </React.Fragment>
              );
            }
            break;
          case 'down':
            if (schemaHasMatchingOperation(isMoveDownComponent)) {
              return (
                <React.Fragment key="op-down-schema">
                  {renderSchemaOperation(isMoveDownComponent)}
                </React.Fragment>
              );
            }
            break;
          case 'copy':
            if (schemaHasMatchingOperation(isCopyComponent)) {
              return (
                <React.Fragment key="op-copy-schema">
                  {renderSchemaOperation(isCopyComponent)}
                </React.Fragment>
              );
            }
            break;
          case 'edit':
            <React.Fragment key="op-edit-schema">
              {renderSchemaOperation(isEditComponent)}
            </React.Fragment>;
            break;
          case 'remove':
            if (schemaHasMatchingOperation(isRemoveComponent)) {
              return (
                <React.Fragment key="op-remove-schema">
                  {renderSchemaOperation(isRemoveComponent)}
                </React.Fragment>
              );
            }
            break;
          default:
            break;
        }
      }

      switch (operation) {
        case 'up':
          return (
            <ArrayBase.MoveUp
              key={override ? `op-${operation}-override` : `op-${operation}`}
              {...commonProps}
            />
          );
        case 'down':
          return (
            <ArrayBase.MoveDown
              key={override ? `op-${operation}-override` : `op-${operation}`}
              {...commonProps}
            />
          );
        case 'copy':
          return (
            <ArrayBase.Copy
              key={override ? `op-${operation}-override` : `op-${operation}`}
              {...commonProps}
            />
          );
        case 'edit':
          return (
            <ArrayBase.Edit
              key={override ? `op-${operation}-override` : `op-${operation}`}
              {...commonProps}
            />
          );
        case 'remove':
          return (
            <ArrayBase.Remove
              key={override ? `op-${operation}-override` : `op-${operation}`}
              {...commonProps}
            />
          );
        default:
          return null;
      }
    };

    const renderAction = (action: ActionItem, ctx: ActionContext) => {
      if (typeof action === 'string') {
        return renderBuiltInOperation(action, undefined, ctx);
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
        action.type === 'remove'
      ) {
        return renderBuiltInOperation(action.type, action, ctx);
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
            customAction.onClick(ctx);
          }}
        >
          {customAction.icon}
        </Button>
      );
    };

    const labelNode = label ?? <ItemLabel schema={schema} index={index} />;

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

    const effectiveLocalActions = localActions;

    const resolvedActions =
      actionContext != null
        ? resolveActions(
            globalDefaultActions,
            effectiveLocalActions,
            array?.props?.transformActions,
            actionContext,
          )
        : [];

    if (!hasEditAction(resolvedActions) && showEditAction) {
      resolvedActions.push('edit');
    }

    // if (!showEditAction) {
    //   resolvedActions = resolvedActions.filter((action) => {
    //     if (typeof action === 'string') {
    //       return action !== 'edit';
    //     }
    //     if ('type' in action) {
    //       return action.type !== 'edit';
    //     }
    //     return true;
    //   });
    // }

    const schemaOperationsNode =
      actionContext != null && array?.field != null ? (
        <RecursionField
          basePath={array.field.address}
          schema={schema}
          name={index}
          filterProperties={(s) => {
            return (
              isMoveDownComponent(s) ||
              isMoveUpComponent(s) ||
              isCopyComponent(s) ||
              isRemoveComponent(s) ||
              isIndexComponent(s)
            );
          }}
          onlyRenderProperties
        />
      ) : null;

    const operationsNode =
      operations ??
      (array?.props?.actions === false ? (
        <>{schemaOperationsNode}</>
      ) : (
        <>{resolvedActions.map((a) => renderAction(a, actionContext!))}</>
      ));

    const content = (
      <>
        {leading}
        <div className="min-w-0 flex-1">{labelNode}</div>
      </>
    );

    return (
      <div className={cn('flex items-center gap-2', className)}>
        {buttonProps ? (
          <button
            {...buttonProps}
            type={buttonProps.type ?? 'button'}
            className={cn(
              'flex flex-1 min-w-0 items-center gap-2',
              contentClassName,
              buttonProps.className,
            )}
          >
            {content}
          </button>
        ) : (
          <div className={cn('flex flex-1 min-w-0 items-center gap-2', contentClassName)}>
            {content}
          </div>
        )}

        {showOperations && (
          <div className={cn('flex items-center gap-1 shrink-0', operationsClassName)}>
            {operationsNode}
          </div>
        )}
      </div>
    );
  },
);

ArrayItemHeaderRow.displayName = 'ArrayItemHeaderRow';
