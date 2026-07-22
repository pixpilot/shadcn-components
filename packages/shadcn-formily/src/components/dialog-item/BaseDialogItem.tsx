import type { DialogContentProps } from '@pixpilot/shadcn-ui';
import type { SyncReactNode } from '../../types';
import type { FormItemProps } from '../form-item';
import type {
  OverlayBaseSlots,
  OverlayProps,
  OverlayTriggerProps,
} from '../overlay-common';
import { cn } from '@pixpilot/shadcn';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ShakeStyles,
} from '@pixpilot/shadcn-ui';
import React from 'react';
import { BaseFormItem } from '../form-item';
import { OverlayFields, OverlayTrigger, useOverlay } from '../overlay-common';

export interface DialogItemProps extends FormItemProps {
  /**
   * Props for the trigger button, e.g. `{ label: 'Write a bio' }`. Without a
   * label it reads `Add <title>` when the field is empty and `Edit <title>`
   * once it holds a value. Settable from an x-reaction via
   * `decoratorProps.trigger`.
   */
  trigger?: OverlayTriggerProps;
  /** Controlled open state of the dialog. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When false, the dialog closes without validating the field first.
   * Default is true.
   */
  validateOnClose?: boolean;
  /** Label of the button that closes the dialog. Set to `null` to hide the footer. */
  doneLabel?: SyncReactNode;
  /**
   * The dialog itself — its `title`, `description`, and `slots`, e.g.
   * `{ title: 'Notes', slots: { content: { className: 'w-2xl' } } }`. Title and
   * description default to the field's label and description.
   */
  dialog?: DialogItemDialogProps;
}

export interface DialogItemDialogSlots extends OverlayBaseSlots {
  content?: DialogContentProps;
  title?: React.ComponentProps<'div'>;
  description?: React.ComponentProps<'div'>;
  footer?: React.ComponentProps<'div'>;
}

export type DialogItemDialogProps = OverlayProps<DialogItemDialogSlots>;

/**
 * Formily decorator that edits a single field inside a dialog.
 *
 * Used in place of FormItem (`x-decorator: 'DialogItem'`), it renders the
 * field's label, description, and validation feedback exactly as FormItem
 * does, but puts a trigger button where the input would sit and moves the
 * input itself into a dialog. The field keeps its own component, so validation
 * and x-reactions behave as they do under FormItem.
 */
export const BaseDialogItem: React.FC<React.PropsWithChildren<DialogItemProps>> = ({
  children,
  label,
  description,
  trigger: triggerProp,
  open: openProp,
  defaultOpen,
  onOpenChange,
  validateOnClose,
  doneLabel = 'Done',
  dialog,
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

  const title = dialog?.title ?? effectiveLabel ?? 'Details';
  const overlayDescription = dialog?.description ?? desc;
  const slots = dialog?.slots;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/*
        The field's input lives in the dialog, so the trigger takes its place
        inside FormItem — label, description, and feedback render as usual.
      */}
      <BaseFormItem
        {...formItemProps}
        label={label}
        description={description}
        feedbackStatus={feedbackStatus}
        feedbackText={feedbackText}
      >
        <DialogTrigger asChild>
          <OverlayTrigger invalid={hasError} {...trigger} />
        </DialogTrigger>
      </BaseFormItem>

      {/*
        Keeps the input mounted (hidden) while the dialog is closed so its
        component state and reactions behave as if it were always rendered.
      */}
      {!open && <OverlayFields>{children}</OverlayFields>}

      <DialogContent
        // Radix warns unless a description exists; an explicit undefined opts out.
        {...(overlayDescription == null ? { 'aria-describedby': undefined } : {})}
        {...slots?.content}
        className={cn(
          'w-full xs:w-md',
          shouldShake && 'pp-shake',
          slots?.content?.className,
        )}
        onInteractOutside={(event) => {
          slots?.content?.onInteractOutside?.(event);
          if (event.defaultPrevented) return;

          /*
           * Always intercept the dismiss and run requestClose so an invalid
           * field is caught before the dialog goes away.
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
        <DialogHeader {...slots?.header}>
          <DialogTitle {...slots?.title}>{title}</DialogTitle>
          {overlayDescription != null && (
            <DialogDescription {...slots?.description}>
              {overlayDescription}
            </DialogDescription>
          )}
        </DialogHeader>

        {/*
          Guarded on `open` so the input is never mounted here and in the hidden
          container at once — Radix keeps the content mounted while it animates out.
          The field has no FormItem inside the dialog, so its feedback is repeated
          here; otherwise a failed close would shake with the message only visible
          behind the dialog.
        */}
        {open && (
          <DialogBody
            {...slots?.body}
            className={cn('grid py-1', gapClass, slots?.body?.className)}
          >
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
          </DialogBody>
        )}

        {doneLabel != null && (
          <DialogFooter {...slots?.footer}>
            <Button type="button" data-slot="footer-button" onClick={requestClose}>
              {doneLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

BaseDialogItem.displayName = 'BaseDialogItem';
