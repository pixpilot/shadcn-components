import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { OverlayProvider } from '../src';
import { Button } from '../src/button';
import { showTypeToConfirmDialog } from '../src/type-to-confirm-dialog';

const SIMULATED_DELAY_MS = 1500;

const meta = {
  title: 'shadcn-ui/TypeToConfirmDialog',
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

function TypeToConfirmDialogStory({ fail = false }: { fail?: boolean }) {
  const [result, setResult] = useState('No dialog action yet.');

  const handleOpenDialog = async () => {
    const confirmed = await showTypeToConfirmDialog({
      title: 'Delete account permanently',
      description: (
        <>
          <p>This removes all of your data, including:</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Projects and files</li>
            <li>Billing records</li>
          </ul>
        </>
      ),
      warning: 'This action is irreversible.',
      confirmWord: 'DELETE',
      confirmText: 'Permanently delete',
      pendingText: 'Deleting...',
      onConfirm: async () =>
        new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (fail) {
              setResult('onConfirm rejected; the dialog stayed open.');
              reject(new Error('Failed'));
            } else {
              resolve();
            }
          }, SIMULATED_DELAY_MS);
        }),
    });

    setResult(
      confirmed ? 'Dialog resolved with confirm.' : 'Dialog resolved with cancel.',
    );
  };

  return (
    <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
      <Button
        variant="destructive"
        onClick={() => {
          handleOpenDialog().catch(() => undefined);
        }}
      >
        Delete account
      </Button>
      <p className="text-sm">{result}</p>
    </div>
  );
}

export const Default: Story = {
  render: () => <TypeToConfirmDialogStory />,
};

export const FailingAction: Story = {
  render: () => <TypeToConfirmDialogStory fail />,
};
