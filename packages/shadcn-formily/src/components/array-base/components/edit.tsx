import type { IArrayBaseOperationProps } from '../types';
import { useField } from '@formily/react';
import { Button } from '@pixpilot/shadcn-ui';
import { EditIcon } from 'lucide-react';
import React from 'react';
import { useArray, useIndex } from '../array-context';

export function ArrayEditButton({
  ref,
  ...props
}: IArrayBaseOperationProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const index = useIndex(props.index);
  const self = useField();
  const array = useArray();

  if (!array) return null;

  return (
    <Button
      type="button"
      variant="ghost"
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
          array.props?.onEdit?.(index);
        }
      }}
    >
      {props.icon !== undefined ? props.icon : <EditIcon className="size-4" />}
    </Button>
  );
}
ArrayEditButton.displayName = 'ArrayEditButton';
