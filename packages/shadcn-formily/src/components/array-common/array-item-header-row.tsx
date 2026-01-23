import type { Schema } from '@formily/react';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { useArrayComponents } from '../array-base';

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
    const { ItemLabel, OperationComponents } = useArrayComponents();

    const labelNode = label ?? <ItemLabel schema={schema} index={index} />;

    const operationsNode = operations ?? (
      <OperationComponents schema={schema} index={index} />
    );

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
