import type { Meta, StoryObj } from '@storybook/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useMemo, useState } from 'react';
import { Button } from '../src/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../src/dialog';
import { dialog, DialogProvider } from '../src/dialog-provider';

interface RegisteredExampleDialogProps {
  description?: string;
  title: string;
}

const RegisteredExampleDialog = NiceModal.create<RegisteredExampleDialogProps>(
  (props) => {
    const modal = useModal();

    const handleClose = (result: string) => {
      modal.resolve(result);
      modal.hide().catch(() => undefined);
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle data-slot="dialog-title">{props.title}</DialogTitle>
            {props.description != null && (
              <DialogDescription>{props.description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose('Dismissed')}>
              Dismiss
            </Button>
            <Button onClick={() => handleClose('Accepted')}>Accept</Button>
          </DialogFooter>
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

function RegisterDialogStoryContent() {
  const [result, setResult] = useState('No dialog action yet.');
  const [isOpen, setIsOpen] = useState(false);
  const registeredDialog = useMemo(
    () =>
      dialog.register('storybook-registered-dialog', RegisteredExampleDialog, {
        title: 'Registered dialog',
      }),
    [],
  );

  const handleTypedShow = async () => {
    setIsOpen(true);

    try {
      const dialogResult = await registeredDialog.show<string>({
        description: 'Opened from the typed controller returned by registerDialog.',
      });

      setResult(dialogResult);
    } finally {
      setIsOpen(false);
    }
  };

  const handleGenericShow = async () => {
    setIsOpen(true);

    try {
      const dialogResult = await dialog.show<string>('storybook-registered-dialog', {
        description: 'Opened by id through showDialog.',
        title: 'Generic dialog call',
      });

      setResult(dialogResult);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">registerDialog</h3>
        <p className="text-sm text-muted-foreground">{result}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => {
            handleTypedShow().catch(() => undefined);
          }}
          disabled={isOpen}
        >
          Typed show
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleGenericShow().catch(() => undefined);
          }}
          disabled={isOpen}
        >
          Generic show
        </Button>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <RegisterDialogStoryContent />,
};
