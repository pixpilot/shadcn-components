import type { IArrayBaseOperationProps } from '../types';
import { useField } from '@formily/react';
import { Button } from '@pixpilot/shadcn-ui';
import { ChevronUpIcon } from 'lucide-react';
import React from 'react';
import { useArray, useIndex } from '../array-context';

export const ArrayMoveUp = React.forwardRef<
  HTMLButtonElement,
  IArrayBaseOperationProps & { index?: number }
>((props, ref) => {
  const index = useIndex(props.index);
  const self = useField();
  const array = useArray();

  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  const isFirst = index === 0;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      {...props}
      disabled={self?.disabled || array.props?.disabled || isFirst}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled || array.props?.disabled || isFirst) return;
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index !== undefined) {
          array?.field?.moveUp?.(index).catch(console.error);
          array?.props?.onMoveUp?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <ChevronUpIcon className="size-4" />}
    </Button>
  );
});

ArrayMoveUp.displayName = 'ArrayMoveUp';
