import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '@pixpilot/shadcn';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ConfirmationDialogProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmationDialog = NiceModal.create<Partial<ConfirmationDialogProps>>((props) => {
  const { title = 'Confirmation Dialog' } = props;

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

  return (
    <Dialog open={modal.visible} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {props.description != null && (
            <DialogDescription>{props.description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              {props.cancelText ?? 'Cancel'}
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm}>{props.confirmText ?? 'Confirm'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ConfirmationDialog.displayName = 'ConfirmationDialog';

export default ConfirmationDialog;
