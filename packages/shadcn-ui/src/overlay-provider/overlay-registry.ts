import type { NiceModalHocProps } from '@ebay/nice-modal-react';
import type { ComponentType, FC } from 'react';
import type { OverlayRegistry } from './types';
import NiceModal, {
  unregister,
  useModal,
  useModal as useNiceModal,
} from '@ebay/nice-modal-react';
import React from 'react';

/**
 * Generic overlay registry built on `@ebay/nice-modal-react`.
 *
 * Nothing here is specific to a Dialog or a Drawer — an "overlay" is any
 * component that accepts controlled `open` / `onOpenChange` props. The
 * `dialog-provider` and `drawer-provider` modules are thin, differently-named
 * facades over this base so their public APIs read naturally (`registerDialog`,
 * `registerDrawer`, …) while sharing a single implementation and a single
 * NiceModal store.
 */

type NiceModalInjectedKeys = keyof NiceModalHocProps;
type OverlayInjectedKeys = 'open' | 'onOpenChange';
type RegisteredOverlayInjectedKeys = NiceModalInjectedKeys | OverlayInjectedKeys;

export interface RegisteredOverlayInjectedProps {
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

type Pretty<TValue> = {
  [TKey in keyof TValue]: TValue[TKey];
} & {};

export type OptionalRegisteredOverlayProps<TProps extends object> = Pretty<
  Omit<TProps, Extract<keyof TProps, RegisteredOverlayInjectedKeys>> &
    Partial<Pick<TProps, Extract<keyof TProps, RegisteredOverlayInjectedKeys>>>
>;

type DefaultedOverlayProps<
  TProps extends object,
  TDefaultProps extends Partial<TProps>,
> = Pretty<
  Omit<TProps, keyof TDefaultProps> &
    Partial<Pick<TProps, Extract<keyof TProps, keyof TDefaultProps>>>
>;

export type EmptyOverlayDefaultProps = Record<never, never>;

export type RegisteredOverlayShowProps<
  TProps extends object,
  TDefaultProps extends Partial<OptionalRegisteredOverlayProps<TProps>> =
    EmptyOverlayDefaultProps,
> = DefaultedOverlayProps<OptionalRegisteredOverlayProps<TProps>, TDefaultProps>;

export interface RegisteredOverlay<
  TProps extends object,
  TDefaultProps extends Partial<OptionalRegisteredOverlayProps<TProps>> =
    EmptyOverlayDefaultProps,
> {
  /** The stable NiceModal id used to register, show, hide, and remove this overlay. */
  id: string;

  /**
   * Opens the registered overlay and passes props to the component.
   *
   * Props are inferred from the registered component. Props supplied as
   * `defaultProps` in `registerOverlay` become optional when calling `show`.
   *
   * @returns A promise that resolves with the value passed to `modal.resolve(...)`
   * inside the overlay component.
   */
  show: <TResult = unknown>(
    props?: RegisteredOverlayShowProps<TProps, TDefaultProps>,
  ) => Promise<TResult>;

  /** Hides the registered overlay without resolving the `show` promise for you. */
  hide: <TResult = unknown>() => Promise<TResult>;

  /**
   * Removes the registered overlay instance from the NiceModal render tree. The
   * id remains registered, so the same controller can show it again.
   */
  remove: () => void;
}

/**
 * Registers an overlay component and returns a typed controller for it.
 *
 * The component is wrapped with NiceModal automatically and receives controlled
 * `open` and `onOpenChange` props.
 *
 * @param id - Stable overlay id used by NiceModal and generic `showOverlay`.
 * @param component - Overlay component. Use `createOverlay(...)` instead when a
 * component needs custom NiceModal lifecycle behavior.
 * @param defaultProps - Optional component props registered as defaults.
 * @returns A controller with `id`, `show`, `hide`, and `remove` helpers.
 */
export function registerOverlay<
  TProps extends object,
  TDefaultProps extends Partial<OptionalRegisteredOverlayProps<TProps>> =
    EmptyOverlayDefaultProps,
>(
  id: string,
  component: React.FC<TProps>,
  defaultProps?: TDefaultProps,
): RegisteredOverlay<TProps, TDefaultProps> {
  const WrappedOverlay = NiceModal.create<OptionalRegisteredOverlayProps<TProps>>(
    (props) => {
      const modal = useModal();
      const {
        open: _open,
        onOpenChange,
        ...componentProps
      } = props as OptionalRegisteredOverlayProps<TProps> &
        RegisteredOverlayInjectedProps;
      const Component = component as React.FC<TProps & RegisteredOverlayInjectedProps>;

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

  WrappedOverlay.displayName = `RegisteredOverlay(${component.displayName ?? component.name ?? id})`;

  NiceModal.register(
    id,
    WrappedOverlay,
    defaultProps as Partial<React.ComponentProps<typeof WrappedOverlay>> | undefined,
  );

  return {
    id,
    show: async <TResult = unknown>(
      props?: RegisteredOverlayShowProps<TProps, TDefaultProps>,
    ): Promise<TResult> => NiceModal.show<TResult>(id, props),
    hide: async <TResult = unknown>(): Promise<TResult> => NiceModal.hide<TResult>(id),
    remove: (): void => {
      NiceModal.remove(id);
    },
  };
}

export const useOverlay = useNiceModal;

export interface CreatedOverlay<TProps extends object> extends FC<
  TProps & NiceModalHocProps
> {
  show: <TResult = unknown>(props?: TProps) => Promise<TResult>;
  hide: <TResult = unknown>() => Promise<TResult>;
  remove: () => void;
}

/**
 * Creates a custom NiceModal overlay component with controller helpers.
 *
 * Use this for overlays that need to drive `useOverlay()` directly. For simple
 * cases prefer `registerOverlay(...)`.
 */
export function createOverlay<TProps extends object>(
  component: ComponentType<TProps>,
): CreatedOverlay<TProps> {
  const Created = NiceModal.create<TProps>(component);

  return Object.assign(Created, {
    show: async <TResult = unknown>(props?: TProps): Promise<TResult> =>
      NiceModal.show<TResult, TProps & NiceModalHocProps, TProps>(Created, props),
    hide: async <TResult = unknown>(): Promise<TResult> =>
      NiceModal.hide<TResult>(Created),
    remove: (): void => {
      NiceModal.remove(Created);
    },
  });
}

export type ShowOverlayProps = Record<string, unknown>;

/**
 * Opens a registered overlay by id when the caller does not have its typed
 * controller. Prefer `registerOverlay(...).show(...)` when the component is
 * available in the same module.
 */
export async function showOverlay<TResult = unknown>(
  id: string,
  props?: ShowOverlayProps,
): Promise<TResult> {
  return NiceModal.show<TResult>(id, props);
}

/** Hides a registered overlay by id. */
export async function hideOverlay<TResult = unknown>(id: string): Promise<TResult> {
  return NiceModal.hide<TResult>(id);
}

/** Removes a registered overlay instance from the render tree by id. */
export function removeOverlay(id: string): void {
  NiceModal.remove(id);
}

/** Unregisters an overlay component by id. */
export function unregisterOverlay(id: string): void {
  unregister(id);
}

export const overlayRegistry: OverlayRegistry = {
  create: createOverlay,
  hide: hideOverlay,
  register: registerOverlay,
  remove: removeOverlay,
  show: showOverlay,
  unregister: unregisterOverlay,
  use: useOverlay,
};
