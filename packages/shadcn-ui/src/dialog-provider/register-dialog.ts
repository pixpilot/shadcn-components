import type { NiceModalHocProps } from '@ebay/nice-modal-react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import React from 'react';

type NiceModalInjectedKeys = keyof NiceModalHocProps;
type DialogInjectedKeys = 'open' | 'onOpenChange';
type RegisteredDialogInjectedKeys = NiceModalInjectedKeys | DialogInjectedKeys;

export interface RegisteredDialogInjectedProps {
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

type Pretty<TValue> = {
  [TKey in keyof TValue]: TValue[TKey];
} & {};

type OptionalRegisteredDialogProps<TProps extends object> = Pretty<
  Omit<TProps, Extract<keyof TProps, RegisteredDialogInjectedKeys>> &
    Partial<Pick<TProps, Extract<keyof TProps, RegisteredDialogInjectedKeys>>>
>;

type DefaultedDialogProps<
  TProps extends object,
  TDefaultProps extends Partial<TProps>,
> = Pretty<
  Omit<TProps, keyof TDefaultProps> &
    Partial<Pick<TProps, Extract<keyof TProps, keyof TDefaultProps>>>
>;

type EmptyDialogDefaultProps = Record<never, never>;

export type RegisteredDialogShowProps<
  TProps extends object,
  TDefaultProps extends Partial<OptionalRegisteredDialogProps<TProps>> =
    EmptyDialogDefaultProps,
> = DefaultedDialogProps<OptionalRegisteredDialogProps<TProps>, TDefaultProps>;

export interface RegisteredDialog<
  TProps extends object,
  TDefaultProps extends Partial<OptionalRegisteredDialogProps<TProps>> =
    EmptyDialogDefaultProps,
> {
  /**
   * The stable NiceModal id used to register, show, hide, and remove this dialog.
   *
   * Usage:
   * ```ts
   * const editProjectDialog = registerDialog('edit-project', EditProjectDialog);
   * console.log(editProjectDialog.id);
   * ```
   */
  id: string;

  /**
   * Opens the registered dialog and passes props to the component.
   *
   * Props are inferred from the registered component. Props supplied as
   * `defaultProps` in `registerDialog` become optional when calling `show`.
   *
   * @returns A promise that resolves with the value passed to `modal.resolve(...)`
   * inside the dialog component.
   *
   * Usage:
   * ```ts
   * const confirmed = await confirmDialog.show<boolean>({
   *   title: 'Delete project?',
   * });
   * ```
   */
  show: <TResult = unknown>(
    props?: RegisteredDialogShowProps<TProps, TDefaultProps>,
  ) => Promise<TResult>;

  /**
   * Hides the registered dialog without resolving the `show` promise for you.
   *
   * @returns A promise from NiceModal that resolves after the hide action is
   * dispatched.
   *
   * Usage:
   * ```ts
   * await editProjectDialog.hide();
   * ```
   */
  hide: <TResult = unknown>() => Promise<TResult>;

  /**
   * Removes the registered dialog instance from the NiceModal render tree.
   *
   * The dialog id remains registered, so the same controller can show it again.
   *
   * @returns Nothing.
   *
   * Usage:
   * ```ts
   * editProjectDialog.remove();
   * ```
   */
  remove: () => void;
}

/**
 * Registers a dialog component and returns a typed controller for it.
 *
 * Use this when a dialog has a known component and you want type-safe props for
 * default values and `show(...)` calls. The component is wrapped with
 * NiceModal automatically, and receives controlled `open` and `onOpenChange`
 * props.
 *
 * @param id - Stable dialog id used by NiceModal and by generic `showDialog`.
 * @param component - Dialog component. Use `dialog.create(...)` instead when a
 * component needs custom NiceModal lifecycle behavior.
 * @param defaultProps - Optional component props registered as defaults.
 * @returns A controller with `id`, `show`, `hide`, and `remove` helpers.
 *
 * Usage:
 * ```ts
 * const projectDialog = registerDialog('project-dialog', ProjectDialog, {
 *   mode: 'edit',
 * });
 *
 * await projectDialog.show({
 *   projectId: 'project-1',
 * });
 * ```
 */
export function registerDialog<
  TProps extends object,
  TDefaultProps extends Partial<OptionalRegisteredDialogProps<TProps>> =
    EmptyDialogDefaultProps,
>(
  id: string,
  component: React.FC<TProps>,
  defaultProps?: TDefaultProps,
): RegisteredDialog<TProps, TDefaultProps> {
  const WrappedDialog = NiceModal.create<OptionalRegisteredDialogProps<TProps>>(
    (props) => {
      const modal = useModal();
      const {
        open: _open,
        onOpenChange,
        ...componentProps
      } = props as OptionalRegisteredDialogProps<TProps> & RegisteredDialogInjectedProps;
      const Component = component as React.FC<TProps & RegisteredDialogInjectedProps>;

      const handleClose = (result: unknown) => {
        modal.resolve(result);
        // eslint-disable-next-line ts/no-floating-promises
        modal.hide();
      };

      return React.createElement(Component, {
        ...(componentProps as TProps),
        open: modal.visible,
        onOpenChange: (isOpen: boolean) => {
          onOpenChange?.(isOpen);

          if (!isOpen) {
            handleClose('Closed');
          }
        },
      });
    },
  );

  WrappedDialog.displayName = `RegisteredDialog(${component.displayName ?? component.name ?? id})`;

  NiceModal.register(
    id,
    WrappedDialog,
    defaultProps as Partial<React.ComponentProps<typeof WrappedDialog>> | undefined,
  );

  return {
    id,
    show: async <TResult = unknown>(
      props?: RegisteredDialogShowProps<TProps, TDefaultProps>,
    ): Promise<TResult> => NiceModal.show<TResult>(id, props),
    hide: async <TResult = unknown>(): Promise<TResult> => NiceModal.hide<TResult>(id),
    remove: (): void => {
      NiceModal.remove(id);
    },
  };
}
