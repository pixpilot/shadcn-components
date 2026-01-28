import { cn } from '@pixpilot/shadcn-ui';
import React from 'react';
import { useFormConfig } from '../../hooks';
import { useArray } from '../array-base/array-context';
import { DragHandle } from '../array-sortable';

export interface ArrayDragHandleProps {
  className?: string;
}

export const ArrayDragHandle: React.FC<ArrayDragHandleProps> = ({ className }) => {
  const array = useArray();
  const formConfig = useFormConfig();

  const arraySortable = (array?.props as Record<string, unknown>)?.sortable;
  const formSortable = formConfig.array?.sortable;

  if (arraySortable === false || formSortable === false) return null;

  return (
    <DragHandle
      className={cn(className)}
      disabled={array?.field?.pattern !== 'editable'}
    />
  );
};

ArrayDragHandle.displayName = 'ArrayDragHandle';
