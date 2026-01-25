import type { Schema } from '@formily/react';
import type { ActionContext, ActionItem, BuiltInOperation } from '../array-base';
import { RecursionField } from '@formily/react';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { useFormConfig } from '../../hooks';
import { resolveActions, useArrayComponents } from '../array-base';
import { useArray, useArrayContext, useRecord } from '../array-base/array-context';

import { DEFAULT_ACTIONS, DEFAULT_ACTIONS_WITH_EDIT } from '../array-base/constants';
import {
  isCopyComponent,
  isIndexComponent,
  isMoveDownComponent,
  isMoveUpComponent,
  isRemoveComponent,
} from '../array-base/utils/is-array-component';
import { DragHandle } from '../array-sortable';
import { RenderAction } from './render-action';

import { hasEditAction, isDisabled, isHidden } from './utils';

export interface ArrayItemHeaderRowSlots {
  content?: React.HTMLAttributes<HTMLDivElement>;
}

export interface ArrayItemHeaderRowProps {
  schema: Schema;
  index: number;

  /** Outer container classes */
  className?: string;

  /** Optional element rendered before the label (e.g., chevron icon) */
  leading?: React.ReactNode;

  /** Override the default label rendering */
  label?: React.ReactNode;

  /**
   * If provided, renders the label area as a button.
   * Useful for collapse/accordion headers.
   */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;

  slots?: ArrayItemHeaderRowSlots;
}

export const ArrayItemHeaderRow: React.FC<ArrayItemHeaderRowProps> = React.memo(
  ({ schema, index, className, leading, label, buttonProps, slots }) => {
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

    // isHidden is now imported from util/is-hidden

    // isDisabled is now imported from util/is-disabled

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
      array?.props?.actions === false ? (
        <>{schemaOperationsNode}</>
      ) : (
        <>
          {resolvedActions.map((a, i) => (
            <RenderAction
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              action={a}
              ctx={actionContext!}
              isHidden={isHidden}
              isDisabled={isDisabled}
              index={index}
              array={array!}
              schema={schema}
            />
          ))}
        </>
      );

    const arraySortable = (array?.props as Record<string, unknown>)?.sortable;
    const formSortable = formConfig.array?.sortable;

    const dragHandleNode =
      arraySortable !== false && formSortable !== false ? (
        <DragHandle className="-ml-2" disabled={array?.field?.pattern !== 'editable'} />
      ) : null;

    const content = (
      <>
        {dragHandleNode}
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
              slots?.content?.className,
              buttonProps.className,
            )}
          >
            {content}
          </button>
        ) : (
          <div
            className={cn(
              'flex flex-1 min-w-0 items-center gap-2',
              slots?.content?.className,
            )}
          >
            {content}
          </div>
        )}

        <div className={cn('flex items-center gap-1 shrink-0')}>{operationsNode}</div>
      </div>
    );
  },
);

ArrayItemHeaderRow.displayName = 'ArrayItemHeaderRow';
