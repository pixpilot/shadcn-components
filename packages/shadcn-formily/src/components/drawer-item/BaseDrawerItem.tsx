import type { DrawerContentProps } from '@pixpilot/shadcn-ui';
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
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@pixpilot/shadcn-ui';
import React from 'react';
import { ShakeStyles } from '../array-common';
import { BaseFormItem } from '../form-item';
import { OverlayFields, OverlayTrigger, useOverlay } from '../overlay-common';

export interface DrawerItemProps extends FormItemProps {
  /**
   * Props for the trigger button, e.g. `{ label: 'Write a bio' }`. Without a
   * label it reads `Add <title>` when the field is empty and `Edit <title>`
   * once it holds a value. Settable from an x-reaction via
   * `decoratorProps.trigger`.
   */
  trigger?: OverlayTriggerProps;
  /** Controlled open state of the drawer. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When false, the drawer closes without validating the field first.
   * Default is true.
   */
  validateOnClose?: boolean;
  /** Label of the button that closes the drawer. Set to `null` to hide the footer. */
  doneLabel?: SyncReactNode;
  /**
   * The drawer itself — its `title`, `description`, and `slots`, e.g.
   * `{ title: 'Notes', slots: { content: { side: 'right' } } }`. Title and
   * description default to the field's label and description.
   */
  drawer?: DrawerItemDrawerProps;
}

export interface DrawerItemDrawerSlots extends OverlayBaseSlots {
  content?: DrawerContentProps;
  title?: React.ComponentProps<'div'>;
  description?: React.ComponentProps<'div'>;
  footer?: React.ComponentProps<'div'>;
}

export type DrawerItemDrawerProps = OverlayProps<DrawerItemDrawerSlots> & {
  /** Edge the drawer anchors to. Passed to the drawer root. Default `bottom`. */
  direction?: 'top' | 'bottom' | 'left' | 'right';
};

/**
 * Formily decorator that edits a single field inside a drawer.
 *
 * Used in place of FormItem (`x-decorator: 'DrawerItem'`), it renders the
 * field's label, description, and validation feedback exactly as FormItem
 * does, but puts a trigger button where the input would sit and moves the
 * input itself into a drawer. The field keeps its own component, so validation
 * and x-reactions behave as they do under FormItem.
 */
export const BaseDrawerItem: React.FC<React.PropsWithChildren<DrawerItemProps>> = ({
  children,
  label,
  description,
  trigger: triggerProp,
  open: openProp,
  defaultOpen,
  onOpenChange,
  validateOnClose,
  doneLabel = 'Done',
  drawer,
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

  const title = drawer?.title ?? effectiveLabel ?? 'Details';
  const overlayDescription = drawer?.description ?? desc;
  const slots = drawer?.slots;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction={drawer?.direction}>
      {/*
        The field's input lives in the drawer, so the trigger takes its place
        inside FormItem — label, description, and feedback render as usual.
      */}
      <BaseFormItem
        {...formItemProps}
        label={label}
        description={description}
        feedbackStatus={feedbackStatus}
        feedbackText={feedbackText}
      >
        <DrawerTrigger asChild>
          <OverlayTrigger invalid={hasError} {...trigger} />
        </DrawerTrigger>
      </BaseFormItem>

      {/*
        Keeps the input mounted (hidden) while the drawer is closed so its
        component state and reactions behave as if it were always rendered.
      */}
      {!open && <OverlayFields>{children}</OverlayFields>}

      <DrawerContent
        // Radix warns unless a description exists; an explicit undefined opts out.
        {...(overlayDescription == null ? { 'aria-describedby': undefined } : {})}
        {...slots?.content}
        className={cn(
          'sm:mx-auto sm:max-w-md',
          shouldShake && 'pp-shake',
          slots?.content?.className,
        )}
        onInteractOutside={(event) => {
          slots?.content?.onInteractOutside?.(event);
          if (event.defaultPrevented) return;

          /*
           * Always intercept the dismiss and run requestClose so an invalid
           * field is caught before the drawer goes away.
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
        <DrawerHeader {...slots?.header}>
          <DrawerTitle {...slots?.title}>{title}</DrawerTitle>
          {overlayDescription != null && (
            <DrawerDescription {...slots?.description}>
              {overlayDescription}
            </DrawerDescription>
          )}
        </DrawerHeader>

        {/*
          Guarded on `open` so the input is never mounted here and in the hidden
          container at once — Radix keeps the content mounted while it animates out.
          The field has no FormItem inside the drawer, so its feedback is repeated
          here; otherwise a failed close would shake with the message only visible
          behind the drawer.
        */}
        {open && (
          <DrawerBody
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
          </DrawerBody>
        )}

        {doneLabel != null && (
          <DrawerFooter {...slots?.footer}>
            <Button type="button" data-slot="footer-button" onClick={requestClose}>
              {doneLabel}
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

BaseDrawerItem.displayName = 'BaseDrawerItem';
