import { useField } from '@formily/react';
import { Button, cn } from '@pixpilot/shadcn-ui';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { getDefaultValue } from '../../../utils';
import { useArray } from '../array-context';

export interface IArrayBaseAdditionProps extends React.ComponentProps<typeof Button> {
  title?: string;
  method?: 'push' | 'unshift';
  defaultValue?: any;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const ArrayAddition = React.forwardRef<HTMLButtonElement, IArrayBaseAdditionProps>(
  (props, ref) => {
    const { fullWidth = true } = props;

    const self = useField();
    const array = useArray();

    if (!array) return null;
    if (array.field?.pattern !== 'editable' && array.field?.pattern !== 'disabled')
      return null;

    return (
      <Button
        type="button"
        variant={fullWidth ? 'ghost' : 'outline'}
        {...props}
        disabled={self?.disabled || array.props?.disabled}
        className={cn(props.className, {
          'w-full border border-dashed border-muted': fullWidth,
        })}
        ref={ref}
        onClick={(e) => {
          if (array.props?.disabled) return;
          if (props.onClick) {
            props.onClick(e);
            if (e.defaultPrevented) return;
          }
          const defaultValue = getDefaultValue(props.defaultValue, array.schema);
          if (props.method === 'unshift') {
            array.field?.unshift?.(defaultValue).catch(console.error);
            array.props?.onAdd?.(0);
          } else {
            array.field?.push?.(defaultValue).catch(console.error);
            array.props?.onAdd?.((array?.field?.value?.length ?? 1) - 1);
          }
        }}
      >
        {props.icon !== undefined ? props.icon : <PlusIcon className="mr-2 size-4" />}
        {props.title ?? self.title ?? props.children ?? 'Add Item'}
      </Button>
    );
  },
);

ArrayAddition.displayName = 'ArrayAddition';
