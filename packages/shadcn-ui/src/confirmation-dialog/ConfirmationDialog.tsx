import type { AlertVariant } from '../variant-config';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@pixpilot/shadcn';
import { variantConfig } from '../variant-config';

export interface ConfirmationDialogProps {
  title: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: AlertVariant;
  showIcon?: boolean;
}

const ConfirmationDialog = NiceModal.create<Partial<ConfirmationDialogProps>>((props) => {
  const { title = 'Confirmation Dialog', variant, showIcon = true } = props;

  const modal = useModal();

  const handleConfirm = () => {
    props.onConfirm?.();
    modal.resolve(true);
    // eslint-disable-next-line ts/no-floating-promises
    modal.hide();
  };

  const handleCancel = () => {
    props.onCancel?.();
    modal.resolve(false);
    // eslint-disable-next-line ts/no-floating-promises
    modal.hide();
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel();
    }
  };

  const config = variant != null ? variantConfig[variant] : null;
  const shouldShowIcon = showIcon && variant != null && variant !== 'default';
  const confirmButtonVariant = variant === 'error' ? 'destructive' : 'default';

  return (
    <Dialog open={modal.visible} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="mb-3">
          <DialogTitle className={cn('flex items-center gap-2', config?.textClass)}>
            {shouldShowIcon && config != null && (
              <config.IconComponent className="size-5 shrink-0" />
            )}
            {title}
          </DialogTitle>
          {props.description != null && (
            <DialogDescription className="mt-3">{props.description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button data-slots="button-cancel" variant="outline" onClick={handleCancel}>
            {props.cancelText ?? 'Cancel'}
          </Button>
          <Button
            data-slots="button-confirm"
            variant={confirmButtonVariant}
            onClick={handleConfirm}
          >
            {props.confirmText ?? 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ConfirmationDialog.displayName = 'ConfirmationDialog';

export default ConfirmationDialog;
