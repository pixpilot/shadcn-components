/* eslint-disable ts/no-floating-promises */
/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { Button } from '../src/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../src/dialog';
import { dialog, DialogProvider, useDialog } from '../src/dialog-provider';

interface RegisteredStoryDialogProps extends ComponentProps<typeof Dialog> {
  description?: string;
  title?: string;
}

function RegisteredStoryDialog({
  description = 'This is a registered dialog component. It can be shown using dialog.show(...) or the typed controller returned by dialog.register(...).',
  title = 'Registered Dialog',
  ...dialogProps
}: RegisteredStoryDialogProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent className="!max-w-[325px]">
        <DialogHeader>
          <DialogTitle data-slot="dialog-title">{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{description}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}

interface CustomStoryDialogProps {
  description?: string;
  title?: string;
}

const CustomStoryDialog = dialog.create<CustomStoryDialogProps>(
  ({
    description = 'This dialog was created with dialog.create(...), so it owns the NiceModal lifecycle directly.',
    title = 'Custom Dialog',
  }) => {
    const modal = useDialog();

    const handleClose = (result: string) => {
      modal.resolve(result);
      modal.hide();
    };

    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose('Closed');
          }
        }}
      >
        <DialogContent className="!max-w-[325px]">
          <DialogHeader>
            <DialogTitle data-slot="dialog-title">{title}</DialogTitle>
          </DialogHeader>
          <DialogBody>{description}</DialogBody>
          <div className="flex justify-end">
            <Button id="close-dialog" onClick={() => handleClose('Done')}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

const meta = {
  title: 'shadcn-ui/RegisterDialog',
  component: DialogProvider,
  args: {
    children: null,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
} satisfies Meta<typeof DialogProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const registeredDialog = useMemo(
      () =>
        dialog.register('storybook-registered-dialog', RegisteredStoryDialog, {
          title: 'Registered dialog',
        }),
      [],
    );

    return (
      <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
        <div>
          <h3 className="text-lg font-semibold">Register Dialog</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            data-slot="show-registered-dialog"
            onClick={() => {
              registeredDialog.show({
                description:
                  'registerDialog now injects open and onOpenChange automatically.',
              });
            }}
          >
            Typed show
          </Button>
        </div>
      </div>
    );
  },
};

export const CustomCreate: Story = {
  render: () => {
    const customDialog = dialog.useDialog(CustomStoryDialog);

    return (
      <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
        <div>
          <h3 className="text-lg font-semibold">dialog.create</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            data-slot="show-dialog"
            onClick={() => {
              customDialog.show({
                description:
                  'Use dialog.create when the component should call useDialog itself.',
              });
            }}
          >
            Custom show
          </Button>
        </div>
      </div>
    );
  },
};
