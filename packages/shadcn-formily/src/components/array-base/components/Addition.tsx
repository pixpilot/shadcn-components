import type { ButtonProps as UiButtonProps } from '@pixpilot/shadcn-ui';
import { useField } from '@formily/react';
import { Button, cn } from '@pixpilot/shadcn-ui';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { getDefaultValue } from '../../../utils';
import { useArray } from '../array-context';

export interface IArrayBaseAdditionProps extends UiButtonProps {
  title?: string;
  method?: 'push' | 'unshift';
  defaultValue?: any;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function ArrayAddition({
  ref,
  ...props
}: IArrayBaseAdditionProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const { fullWidth = true } = props;
  const self = useField();
  const array = useArray();

  const currentLength = Array.isArray(array?.field?.value) ? array.field.value.length : 0;
  const maxItems = array?.schema?.maxItems;
  const isAtMax = typeof maxItems === 'number' && currentLength >= maxItems;
  const isDisabled = Boolean(self?.disabled || array?.props?.disabled || isAtMax);

  const tooltip = isAtMax ? `Maximum of ${maxItems} items reached` : props.tooltip;

  if (!array) return null;
  if (array.field?.pattern !== 'editable' && array.field?.pattern !== 'disabled')
    return null;

  const defaultLabel: React.ReactNode =
    props.title ?? (self.title as string) ?? props.children ?? 'Add Item';
  const buttonLabel = isAtMax
    ? `Limit Reached (${currentLength}/${maxItems})`
    : defaultLabel;

  return (
    <Button
      type="button"
      variant={fullWidth ? 'ghost' : 'outline'}
      {...props}
      disabledTooltip={tooltip}
      disabled={isDisabled}
      className={cn(props.className, {
        'w-full border border-dashed border-muted': fullWidth,
      })}
      ref={ref}
      onClick={(e) => {
        if (array.props?.disabled || isAtMax) return;
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) return;
        }
        const defaultValue = getDefaultValue(props.defaultValue, array.schema);

        // Draft-only mode (manual save): open editor without mutating the array.
        // Only explicit `true` enables immediate insertion.
        const isAutoSave =
          (array.props as { autoSave?: boolean } | undefined)?.autoSave === true;
        if (!isAutoSave) {
          const method = props.method ?? 'push';
          const insertionIndex = method === 'unshift' ? 0 : currentLength;

          array.props?.onAdd?.(insertionIndex, {
            mode: 'draft-only',
            method,
            initialDraftValue: defaultValue,
          });
          return;
        }

        if (props.method === 'unshift') {
          array.field?.unshift?.(defaultValue).catch(console.error);
          array.props?.onAdd?.(0);
        } else {
          array.field?.push?.(defaultValue).catch(console.error);
          array.props?.onAdd?.((array?.field?.value?.length ?? 1) - 1);
        }
      }}
    >
      {!isAtMax &&
        (props.icon !== undefined ? props.icon : <PlusIcon className="mr-2 size-4" />)}
      {buttonLabel}
    </Button>
  );
}
ArrayAddition.displayName = 'ArrayAddition';
