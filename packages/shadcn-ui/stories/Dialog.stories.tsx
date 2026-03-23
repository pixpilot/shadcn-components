import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@pixpilot/shadcn';
import * as React from 'react';
import { Button } from '../src/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../src/dialog';

/**
 * A modal dialog component for displaying content in an overlay.
 * Built on top of Radix UI Dialog primitive.
 */
const meta = {
  title: 'shadcn-ui/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default dialog with title, description, and footer actions
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog without a close button
 */
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Simple dialog with minimal content
 */
export const Simple: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
        </DialogHeader>
        <p>This is a simple dialog with just a title and some content.</p>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with long content to demonstrate scrolling
 */
export const LongDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Long Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Long Dialog Example</DialogTitle>
          <DialogDescription>
            This dialog contains a lot of content to demonstrate how the dialog handles
            long text and scrolling behavior.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`field-${i}`} className="text-right">
                Field {i + 1}
              </Label>
              <input
                id={`field-${i}`}
                defaultValue={`Sample value for field ${i + 1}. This is some example text that demonstrates the content of this field.`}
                className="col-span-3"
              />
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

interface ContainerDialogStoryProps {
  title: string;
  description: string;
  buttonLabel: string;
  bodyText: string;
  preventBackdropClickClose?: boolean;
}

function ContainerDialogStoryContent({
  title,
  description,
  buttonLabel,
  bodyText,
  preventBackdropClickClose = false,
}: ContainerDialogStoryProps) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const containerRef = React.useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">{description}</p>
      {/* Container the dialog will be scoped to */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border w-[480px] h-[320px] flex items-center justify-center bg-muted/30"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{buttonLabel}</Button>
          </DialogTrigger>
          <DialogContent
            container={container}
            className="sm:max-w-[360px]"
            disableOutsideClick={preventBackdropClickClose}
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{bodyText}</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm">
                The overlay and dialog are clipped to the box above.
              </p>
            </DialogBody>
            <DialogFooter>
              <Button>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/**
 * Dialog rendered inside a specific container element rather than the document
 * body. The container needs `position: relative` and `overflow: hidden` so the
 * overlay and content are clipped to it.
 */
export const InContainer: Story = {
  render: () => (
    <ContainerDialogStoryContent
      title="In-Container Dialog"
      description="The dialog opens inside the bordered box, not the full page."
      buttonLabel="Open Dialog In Container"
      bodyText="This dialog is scoped to its parent container, and outside clicks will close it."
    />
  ),
};

/**
 * Dialog rendered inside a container and kept open when clicking the overlay.
 */
export const InContainerWithoutBackdropDismiss: Story = {
  render: () => (
    <ContainerDialogStoryContent
      title="Persistent In-Container Dialog"
      description="The dialog opens inside the bordered box and stays open when the backdrop is clicked."
      buttonLabel="Open Persistent Dialog In Container"
      bodyText="This dialog is scoped to its parent container, and outside clicks will not close it."
      preventBackdropClickClose
    />
  ),
};

function PersistentDialogStoryContent() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Persistent Dialog</Button>
      </DialogTrigger>
      <DialogContent disableOutsideClick className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Persistent Dialog</DialogTitle>
          <DialogDescription>
            Clicking the backdrop will not close this dialog.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dialog that stays open when the backdrop is clicked.
 */
export const WithoutBackdropDismiss: Story = {
  render: () => <PersistentDialogStoryContent />,
};
