'use client';

import { Badge } from '@pixpilot/shadcn';
import { Button } from '@pixpilot/shadcn-ui';
import { Loader2 } from 'lucide-react';

import { describeAuthProvider } from '../../constants/auth-providers';
import { ProviderIcon } from '../provider-icon/ProviderIcon';

export interface SignInMethodRowProps {
  /** Supabase provider key, e.g. `'google'`. */
  provider: string;
  /** Address this provider supplied, shown under the label when known. */
  email?: string | null;
  /** Whether the provider is already attached to the account. */
  isConnected: boolean;
  /** Whether this row's connect flow is in flight. */
  isPending?: boolean;
  /** Disables the connect button while some other row is mid-flow. */
  isDisabled?: boolean;
  /** Starts connecting this provider. Absent on rows that cannot be connected. */
  onConnect?: (provider: string) => void;
}

/**
 * One sign-in method: what it is, which account it points at, and — when it is
 * not attached yet — the button that attaches it.
 */
export function SignInMethodRow({
  provider,
  email,
  isConnected,
  isPending = false,
  isDisabled = false,
  onConnect,
}: SignInMethodRowProps) {
  const label = describeAuthProvider(provider);

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <ProviderIcon provider={provider} className="text-muted-foreground h-5 w-5" />
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          {email != null && email.length > 0 && (
            <p className="text-muted-foreground truncate text-xs">{email}</p>
          )}
        </div>
      </div>

      {isConnected ? (
        <Badge variant="secondary">Connected</Badge>
      ) : (
        onConnect != null && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending || isDisabled}
            onClick={() => onConnect(provider)}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Connecting...' : `Connect ${label}`}
          </Button>
        )
      )}
    </li>
  );
}
