import type { ReactNode } from 'react';
import { Button, Input } from '@pixpilot/shadcn';
import { Loader2 } from 'lucide-react';
import { useId, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog';
import { dialog } from '../dialog-registry';
import { getId } from '../utils';

export interface TypeToConfirmDialogProps {
  id?: string;
  title: string;
  /** What the action does. Rendered in a `div`, so block content is fine. */
  description?: ReactNode;
  /** Emphasised line under the description, e.g. "This cannot be undone." */
  warning?: ReactNode;
  /** The exact text the user must type before the confirm button enables. */
  confirmWord: string;
  /** Label above the input. Defaults to "Type <confirmWord> to confirm:". */
  confirmLabel?: ReactNode;
  /** Input placeholder. Defaults to `confirmWord`. */
  confirmPlaceholder?: string;
  confirmText?: string;
  /** Confirm button label while `onConfirm` is pending. */
  pendingText?: string;
  cancelText?: string;
  /**
   * Performs the action. The dialog awaits it: it closes (resolving `true`)
   * when it settles, and stays open and re-enabled when it rejects, so the
   * user can retry. Surfacing the error is the caller's job.
   */
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

const TypeToConfirmDialog = dialog.create<Partial<TypeToConfirmDialogProps>>((props) => {
  const {
    id,
    title = 'Are you sure?',
    description,
    warning,
    confirmWord = '',
    confirmLabel,
    confirmPlaceholder,
    confirmText = 'Confirm',
    pendingText = 'Working...',
    cancelText = 'Cancel',
  } = props;

  const modal = dialog.use();
  const generatedId = useId();
  const inputId = getId(id, 'input') ?? generatedId;
  const [typed, setTyped] = useState('');
  const [pending, setPending] = useState(false);
  const matches = confirmWord.length > 0 && typed === confirmWord;

  const close = (confirmed: boolean) => {
    setTyped('');
    modal.resolve(confirmed);
    // eslint-disable-next-line ts/no-floating-promises
    modal.hide();
  };

  const handleCancel = () => {
    if (pending) return;
    props.onCancel?.();
    close(false);
  };

  const handleConfirm = async () => {
    if (!matches || pending) return;
    setPending(true);
    try {
      await props.onConfirm?.();
      close(true);
    } catch {
      // Stay open so the user can retry; the caller surfaces the error.
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleCancel();
      }}
    >
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {description != null && (
              <DialogDescription asChild>
                <div className="text-muted-foreground text-sm">{description}</div>
              </DialogDescription>
            )}
            {warning != null && (
              <div className="text-destructive text-sm font-semibold">{warning}</div>
            )}
            <div className="flex flex-col space-y-1">
              <label htmlFor={inputId} className="text-muted-foreground text-sm">
                {confirmLabel ?? (
                  <>
                    Type <strong>{confirmWord}</strong> to confirm:
                  </>
                )}
              </label>
              <Input
                id={inputId}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                placeholder={confirmPlaceholder ?? confirmWord}
                autoComplete="off"
                disabled={pending}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            id={getId(id, 'cancel-button')}
            data-slots="button-cancel"
            variant="outline"
            onClick={handleCancel}
            disabled={pending}
          >
            {cancelText}
          </Button>
          <Button
            id={id}
            data-slots="button-confirm"
            variant="destructive"
            onClick={() => {
              handleConfirm().catch(() => undefined);
            }}
            disabled={!matches || pending}
          >
            {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {pending ? pendingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

TypeToConfirmDialog.displayName = 'TypeToConfirmDialog';

export default TypeToConfirmDialog;
