import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '../src/Button';
import { DialogProvider, showConfirmDialog } from '../src/confirmation-dialog';

const meta = {
  title: 'shadcn-ui/ConfirmationDialog',
  component: DialogProvider,
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

function ConfirmationDialogStory({ description }: { description: ReactNode }) {
  const [result, setResult] = useState('No dialog action yet.');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = async () => {
    setIsOpen(true);

    try {
      const confirmed = await showConfirmDialog({
        title: 'Delete project?',
        description,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      });

      setResult(
        confirmed ? 'Dialog resolved with confirm.' : 'Dialog resolved with cancel.',
      );
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">showConfirmDialog</h3>
        <p className="text-muted-foreground text-sm">
          Click the button below to open the confirmation dialog and inspect the result.
        </p>
      </div>
      <Button
        onClick={() => {
          handleOpenDialog().catch(() => undefined);
        }}
        disabled={isOpen}
      >
        {isOpen ? 'Dialog open...' : 'Open confirmation dialog'}
      </Button>
      <p className="text-sm">{result}</p>
    </div>
  );
}

export const Default: Story = {
  render: () => <ConfirmationDialogStory description="This action cannot be undone." />,
};

export const WithReactNodeDescription: Story = {
  render: () => (
    <ConfirmationDialogStory
      description={
        <>
          <div>
            This action will permanently remove the project and all related data.{' '}
          </div>
          <span className="font-medium text-foreground">
            Make sure you have exported anything you need first.
          </span>
        </>
      }
    />
  ),
};
