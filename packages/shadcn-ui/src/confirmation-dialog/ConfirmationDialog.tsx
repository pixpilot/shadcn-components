import type { AlertVariant } from '../variant-config';
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
import { dialog } from '../dialog-registry';
import { getId } from '../utils';
import { variantConfig } from '../variant-config';

export type ConfirmationDialogVariant = 'destructive' | 'warning' | 'primary' | 'default';

const variantMap: Record<ConfirmationDialogVariant, AlertVariant> = {
  destructive: 'error',
  warning: 'warning',
  primary: 'info',
  default: 'default',
};

export interface ConfirmationDialogProps {
  id?: string;
  title: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: ConfirmationDialogVariant;
  showIcon?: boolean;
}

const ConfirmationDialog = dialog.create<Partial<ConfirmationDialogProps>>((props) => {
  const { id, title = 'Confirmation Dialog', variant, showIcon = true } = props;

  const modal = dialog.use();

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

  const config = variant != null ? variantConfig[variantMap[variant]] : null;
  const shouldShowIcon = showIcon && variant != null && variant !== 'default';

  const confirmButtonConfig: Record<
    ConfirmationDialogVariant,
    { variant: 'default' | 'destructive'; className?: string }
  > = {
    destructive: { variant: 'destructive' },
    /*
     * Warning and primary don't have a direct shadcn button variant, so we
     * use `default` as the base and override the background color via
     * className to visually match the dialog variant.
     */
    warning: {
      variant: 'default',
      className:
        'bg-amber-600 hover:bg-amber-600/90 dark:bg-amber-500 dark:hover:bg-amber-500/90 text-white',
    },
    primary: { variant: 'default' },
    default: { variant: 'default' },
  };

  const { variant: confirmBtnVariant, className: confirmBtnClassName } =
    variant != null ? confirmButtonConfig[variant] : { variant: 'default' as const };

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
          <Button
            id={getId(id, 'cancel-button')}
            data-slots="button-cancel"
            variant="outline"
            onClick={handleCancel}
          >
            {props.cancelText ?? 'Cancel'}
          </Button>
          <Button
            id={id}
            data-slots="button-confirm"
            variant={confirmBtnVariant}
            className={confirmBtnClassName}
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
