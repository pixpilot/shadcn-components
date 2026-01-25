import type { IArrayBaseOperationProps } from '../types';
import { useField } from '@formily/react';
import { Button } from '@pixpilot/shadcn-ui';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import { useArray, useIndex } from '../array-context';

export function ArrayMoveDown({
  ref,
  ...props
}: IArrayBaseOperationProps & { index?: number } & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) {
  const index = useIndex(props.index);
  const self = useField();
  const array = useArray();

  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  const isLast = index === (array.field?.value?.length ?? 0) - 1;

  return (
    <Button
      type="button"
      variant="ghost"
      tooltip="Move Down"
      size="icon"
      {...props}
      disabled={
        self?.disabled || array.props?.disabled || Boolean(props.disabled) || isLast
      }
      ref={ref}
      onClick={(e) => {
        if (
          self?.disabled ||
          array.props?.disabled ||
          Boolean(props.disabled) ||
          isLast
        ) {
          return;
        }
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index !== undefined) {
          array.field?.moveDown?.(index).catch(console.error);
          array.props?.onMoveDown?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <ChevronDownIcon className="size-4" />}
    </Button>
  );
}

ArrayMoveDown.displayName = 'ArrayMoveDown';
