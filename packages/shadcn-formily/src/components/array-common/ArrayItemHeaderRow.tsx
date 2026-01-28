import type { Schema } from '@formily/react';
import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { useArrayComponents } from '../array-base';
import { ArrayDragHandle } from './ArrayDragHandle';
import { ArrayItemOperations } from './ArrayItemOperations';
import { useArrayItemActions } from './use-array-item-actions';

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

    const { array, actionContext, resolvedActions } = useArrayItemActions({
      index,
      ensureEditAction: true,
    });

    const labelNode = label ?? <ItemLabel schema={schema} index={index} />;

    // isHidden is now imported from util/is-hidden

    // isDisabled is now imported from util/is-disabled

    const content = (
      <>
        {leading}
        <div className="min-w-0 flex-1">{labelNode}</div>
      </>
    );

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <ArrayDragHandle className="-ml-2" />
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

        <div className={cn('flex items-center gap-1 shrink-0')}>
          <ArrayItemOperations
            schema={schema}
            index={index}
            array={array}
            actionContext={actionContext}
            resolvedActions={resolvedActions}
          />
        </div>
      </div>
    );
  },
);

ArrayItemHeaderRow.displayName = 'ArrayItemHeaderRow';
