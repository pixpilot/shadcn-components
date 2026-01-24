import type { Schema } from '@formily/react';
import type { ActionContext, BuiltInOperation, OperationOverride } from '../array-base';
import type { IArrayBaseContext } from '../array-base/array-context';
import { RecursionField } from '@formily/react';
import React from 'react';
import { ArrayBase } from '../array-base';
import {
  isCopyComponent,
  isEditComponent,
  isMoveDownComponent,
  isMoveUpComponent,
  isRemoveComponent,
} from '../array-base/utils/is-array-component';

interface RenderBuiltInOperationProps {
  operation: BuiltInOperation;
  override: OperationOverride | undefined;
  ctx: ActionContext;
  index: number;
  array: IArrayBaseContext | null;
  schema: Schema;
  isHidden: (hidden: OperationOverride['hidden'], ctx: ActionContext) => boolean;
  isDisabled: (disabled: OperationOverride['disabled'], ctx: ActionContext) => boolean;
}

export const RenderBuiltInOperation: React.FC<RenderBuiltInOperationProps> = ({
  operation,
  override,
  ctx,
  index,
  array,
  schema,
  isHidden,
  isDisabled,
}) => {
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
    const props = (schema as unknown as { properties?: Record<string, unknown> } | null)
      ?.properties;
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
        if (schemaHasMatchingOperation(isEditComponent)) {
          return (
            <React.Fragment key="op-edit-schema">
              {renderSchemaOperation(isEditComponent)}
            </React.Fragment>
          );
        }
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
