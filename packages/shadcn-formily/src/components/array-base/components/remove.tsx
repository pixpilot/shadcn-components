import type { IArrayBaseOperationProps } from '../types';
import { useField } from '@formily/react';
import { Button } from '@pixpilot/shadcn-ui';
import { Trash2Icon } from 'lucide-react';
import React from 'react';
import { useArray, useIndex } from '../array-context';

export function ArrayRemove({
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

  return (
    <Button
      type="button"
      variant="ghost"
      tooltip="Remove"
      size="icon"
      {...props}
      disabled={self?.disabled || array.props?.disabled}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled || array.props?.disabled) return;
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index !== undefined) {
          array.field?.remove?.(index).catch(console.error);
          array.props?.onRemove?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <Trash2Icon className="size-4" />}
    </Button>
  );
}

ArrayRemove.displayName = 'ArrayRemove';
