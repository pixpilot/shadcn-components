import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import type { ConfirmationDialogVariant } from '../src/confirmation-dialog';
import { useState } from 'react';
import { OverlayProvider } from '../src';
import { Button } from '../src/button';
import { showConfirmDialog } from '../src/confirmation-dialog';

const meta = {
  title: 'shadcn-ui/ConfirmationDialog',
  component: OverlayProvider,
  args: {
    children: null,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
} satisfies Meta<typeof OverlayProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfirmationDialogStory({
  description,
  variant,
  confirmText,
  showIcon,
}: {
  description: ReactNode;
  variant?: ConfirmationDialogVariant;
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
    <div
      id="confirmation-dialog-div-1"
      className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm"
    >
      <div id="confirmation-dialog-div-2">
        <h3 id="confirmation-dialog-h3-1" className="text-lg font-semibold">
          showConfirmDialog
        </h3>
        <p id="confirmation-dialog-p-1" className="text-muted-foreground text-sm">
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
      <p id="confirmation-dialog-p-2" className="text-sm">
        {result}
      </p>
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
          <div id="confirmation-dialog-div-3">
            This action will permanently remove the project and all related data.{' '}
          </div>
          <span id="confirmation-dialog-span-1" className="font-medium text-foreground">
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
      variant="destructive"
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

export const primaryVariant: Story = {
  render: () => (
    <ConfirmationDialogStory
      variant="primary"
      confirmText="Got it"
      description="This will send a notification to all project members."
    />
  ),
};

export const NestedDialogProvider: Story = {
  render: () => (
    <OverlayProvider>
      <ConfirmationDialogStory description="This story nests a second DialogProvider inside the Storybook provider to verify confirm dialogs still work in provider trees." />
    </OverlayProvider>
  ),
};
