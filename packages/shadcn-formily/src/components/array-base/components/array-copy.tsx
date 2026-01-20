/* eslint-disable ts/no-floating-promises */
import type { IArrayBaseOperationProps } from '../types';
import { useField } from '@formily/react';
import { clone } from '@formily/shared';
import { Button } from '@pixpilot/shadcn-ui';
import { CopyIcon } from 'lucide-react';
import React from 'react';
import { useArray, useIndex } from '../array-context';

export function ArrayCopy({
  ref,
  ...props
}: IArrayBaseOperationProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const self = useField();
  const array = useArray();
  const index = useIndex(props.index);

  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      tooltip="Copy"
      {...props}
      disabled={self?.disabled || array.props?.disabled}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled) return;
        e.stopPropagation();
        if (array.props?.disabled) return;
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        if (index === undefined) return;
        // eslint-disable-next-line ts/no-unsafe-assignment
        const value = clone(array?.field?.value[index]);
        const distIndex = index + 1;
        array.field?.insert?.(distIndex, value);
        array.props?.onCopy?.(distIndex);
      }}
    >
      {props.icon !== undefined ? props.icon : <CopyIcon className="size-4" />}
    </Button>
  );
}
