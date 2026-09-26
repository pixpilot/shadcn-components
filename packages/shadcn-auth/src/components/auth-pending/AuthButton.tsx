'use client';

import type { ButtonExtendedProps } from '@pixpilot/shadcn-ui';

import { ButtonExtended } from '@pixpilot/shadcn-ui';

import { useAuthPending } from './auth-pending-context';

export interface AuthButtonProps extends Omit<
  ButtonExtendedProps,
  'loading' | 'loaderProps'
> {
  /**
   * Identifies this button's action within the card. The button spins only
   * while the action under this key is the one running; omit it for a button
   * that starts no async work of its own, such as a step switch.
   */
  actionKey?: string;
  /**
   * Async work this button starts, tracked under `actionKey`. A submit button
   * leaves this out — its form's `onSubmit` runs the action, because only the
   * form knows whether validation passed.
   */
  onAction?: () => Promise<void>;
}

/**
 * A button on an auth card, wired to the card's pending scope.
 *
 * It takes its `loading` and `disabled` from that scope rather than from a flag
 * passed down: the button whose action is running is the only one that spins,
 * and every other control on the card goes disabled until it settles. Passing
 * `disabled` still forces the button off for reasons of its own — an unticked
 * consent box, a resend still in its cooldown.
 */
export function AuthButton({
  actionKey,
  onAction,
  onClick,
  disabled,
  ...rest
}: AuthButtonProps) {
  const pending = useAuthPending();
  const loading = actionKey != null && pending.pendingKey === actionKey;

  return (
    <ButtonExtended
      {...rest}
      loading={loading}
      loaderProps={{ placement: 'start' }}
      disabled={disabled === true || pending.isBusy}
      onClick={(event) => {
        onClick?.(event);
        if (onAction != null && actionKey != null) {
          pending.run(actionKey, onAction);
        }
      }}
    />
  );
}
