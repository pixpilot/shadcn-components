import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import type { AlertVariant } from '../src/variant-config';
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

function ConfirmationDialogStory({
  description,
  variant,
  confirmText,
  showIcon,
}: {
  description: ReactNode;
  variant?: AlertVariant;
  confirmText?: string;
  showIcon?: boolean;
}) {
  const [result, setResult] = useState('No dialog action yet.');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = async () => {
    setIsOpen(true);

    try {
      const confirmed = await showConfirmDialog({
        title: 'Delete project?',
        description,
        confirmText: confirmText ?? 'Delete',
        cancelText: 'Cancel',
        variant,
        showIcon,
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

export const ErrorVariant: Story = {
  render: () => (
    <ConfirmationDialogStory
      variant="error"
      confirmText="Delete"
      description="This will permanently delete the project and all related data. This action cannot be undone."
    />
  ),
};

export const WarningVariant: Story = {
  render: () => (
    <ConfirmationDialogStory
      variant="warning"
      confirmText="Proceed"
      description="This action may have unintended side effects. Please review before continuing."
    />
  ),
};

export const InfoVariant: Story = {
  render: () => (
    <ConfirmationDialogStory
      variant="info"
      confirmText="Got it"
      description="This will send a notification to all project members."
    />
  ),
};

export const SuccessVariant: Story = {
  render: () => (
    <ConfirmationDialogStory
      variant="success"
      confirmText="Publish"
      description="Your changes are ready. Publishing will make them visible to all users."
    />
  ),
};

export const NoIcon: Story = {
  render: () => (
    <ConfirmationDialogStory
      variant="info"
      showIcon={false}
      confirmText="Understood"
      description="The confirmation dialog keeps the variant styling, but the icon is hidden."
    />
  ),
};
