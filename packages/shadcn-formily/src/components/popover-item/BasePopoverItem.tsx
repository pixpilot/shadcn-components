import type { FormItemProps } from '../form-item';
import type {
  OverlayBaseSlots,
  OverlayProps,
  OverlayTriggerProps,
} from '../overlay-common';
import { cn, Popover, PopoverContent, PopoverTrigger } from '@pixpilot/shadcn';
import { ShakeStyles } from '@pixpilot/shadcn-ui';

import React from 'react';
import { BaseFormItem } from '../form-item';
import { OverlayFields, OverlayTrigger, useOverlay } from '../overlay-common';

// `popover` is omitted from the inherited div props: this decorator's own
// `popover` prop replaces the native HTML popover attribute, which it has no use for.
export interface PopoverItemProps extends Omit<FormItemProps, 'popover'> {
  /**
   * Props for the trigger button, e.g. `{ label: 'Write a bio' }`. Without a
   * label it reads `Add <title>` when the field is empty and `Edit <title>`
   * once it holds a value. Settable from an x-reaction via
   * `decoratorProps.trigger`.
   */
  trigger?: OverlayTriggerProps;
  /** Controlled open state of the popover. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When false, the popover closes without validating the field first.
   * Default is true.
   */
  validateOnClose?: boolean;
  /**
   * If true, interaction outside the popover is blocked while it is open.
   * Default is false.
   */
  modal?: boolean;
  /**
   * The popover itself — its `title`, `description`, and `slots`, e.g.
   * `{ title: 'Notes', slots: { content: { className: 'w-96' } } }`. Title and
   * description default to the field's label and description.
   */
  popover?: PopoverItemPopoverProps;
}

export interface PopoverItemPopoverSlots extends OverlayBaseSlots {
  content?: React.ComponentProps<typeof PopoverContent>;
  title?: React.ComponentProps<'h4'>;
  description?: React.ComponentProps<'p'>;
}

export type PopoverItemPopoverProps = OverlayProps<PopoverItemPopoverSlots>;

/**
 * Formily decorator that edits a single field inside a popover.
 *
 * Used in place of FormItem (`x-decorator: 'PopoverItem'`), it renders the
 * field's label, description, and validation feedback exactly as FormItem
 * does, but puts a trigger button where the input would sit and moves the
 * input itself into a popover. The field keeps its own component, so
 * validation and x-reactions behave as they do under FormItem.
 */
export const BasePopoverItem: React.FC<React.PropsWithChildren<PopoverItemProps>> = ({
  children,
  label,
  description,
  trigger: triggerProp,
  open: openProp,
  defaultOpen,
  onOpenChange,
  validateOnClose,
  modal = false,
  popover,
  feedbackStatus,
  feedbackText,
  ...formItemProps
}) => {
  const {
    label: effectiveLabel,
    description: desc,
    trigger,
    open,
    gapClass,
    hasError,
    shouldShake,
    handleOpenChange,
    requestClose,
  } = useOverlay({
    label,
    description,
    trigger: triggerProp,
    open: openProp,
    defaultOpen,
    onOpenChange,
    validateOnClose,
  });

  const title = popover?.title ?? effectiveLabel;
  const overlayDescription = popover?.description ?? desc;
  const slots = popover?.slots;
  const hasHeader = title != null || overlayDescription != null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={modal}>
      {/*
        The field's input lives in the popover, so the trigger takes its place
        inside FormItem — label, description, and feedback render as usual.
      */}
      <BaseFormItem
        {...formItemProps}
        label={label}
        description={description}
        feedbackStatus={feedbackStatus}
        feedbackText={feedbackText}
      >
        <PopoverTrigger asChild>
          <OverlayTrigger invalid={hasError} {...trigger} />
        </PopoverTrigger>
      </BaseFormItem>

      {/*
        Keeps the input mounted (hidden) while the popover is closed so its
        component state and reactions behave as if it were always rendered.
      */}
      {!open && <OverlayFields>{children}</OverlayFields>}

      <PopoverContent
        align="start"
        {...slots?.content}
        className={cn(
          'w-(--radix-popover-trigger-width) min-w-72',
          shouldShake && 'pp-shake',
          slots?.content?.className,
        )}
        onInteractOutside={(event) => {
          slots?.content?.onInteractOutside?.(event);
          if (event.defaultPrevented) return;

          /*
           * Always intercept the dismiss and run requestClose so an invalid
           * field is caught before the popover goes away.
           */
          event.preventDefault();
          requestClose();
        }}
        onEscapeKeyDown={(event) => {
          slots?.content?.onEscapeKeyDown?.(event);
          if (event.defaultPrevented) return;

          event.preventDefault();
          requestClose();
        }}
      >
        <ShakeStyles />
        {hasHeader && (
          <div
            {...slots?.header}
            className={cn('space-y-1 pb-3', slots?.header?.className)}
          >
            {title != null && (
              <h4
                {...slots?.title}
                className={cn('font-medium leading-none', slots?.title?.className)}
              >
                {title}
              </h4>
            )}
            {overlayDescription != null && (
              <p
                {...slots?.description}
                className={cn(
                  'text-muted-foreground text-sm',
                  slots?.description?.className,
                )}
              >
                {overlayDescription}
              </p>
            )}
          </div>
        )}

        {/*
          Guarded on `open` so the input is never mounted here and in the hidden
          container at once — Radix keeps the content mounted while it animates out.
          The field has no FormItem inside the popover, so its feedback is repeated
          here; otherwise a failed close would shake with the message only visible
          behind the popover.
        */}
        {open && (
          <div {...slots?.body} className={cn('grid', gapClass, slots?.body?.className)}>
            {children}
            {feedbackText != null && feedbackText !== '' && (
              <p
                className={cn(
                  'text-[0.8rem]',
                  feedbackStatus === 'error' && 'text-destructive font-medium',
                  feedbackStatus === 'warning' && 'text-amber-600',
                  feedbackStatus === 'success' && 'text-green-600',
                )}
              >
                {feedbackText}
              </p>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

BasePopoverItem.displayName = 'BasePopoverItem';
