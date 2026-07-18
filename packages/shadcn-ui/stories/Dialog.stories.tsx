/* eslint-disable ts/no-floating-promises */
/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Label } from '@pixpilot/shadcn';
import * as React from 'react';
import { OverlayProvider } from '../src';
import { Button } from '../src/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../src/card';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../src/dialog';
import { dialog, useDialog } from '../src/dialog-registry';

// --- Provider-driven (imperative) dialogs ---
// These demonstrate the dialog-registry (registerDialog / dialog.create)
// alongside the declarative examples, so every Dialog story lives in one place.

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

const customStoryDialog = dialog.create<CustomStoryDialogProps>(
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
        <DialogBody>
          <div id="dialog-div-1" className="grid gap-4 py-4">
            <div id="dialog-div-2" className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
            </div>
            <div id="dialog-div-3" className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <input id="username" defaultValue="@peduarte" className="col-span-3" />
            </div>
          </div>
        </DialogBody>
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
        <DialogBody>
          <p id="dialog-p-1">
            This is a simple dialog with just a title and some content.
          </p>
        </DialogBody>
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
            <div
              id="dialog-div-4"
              key={i}
              className="grid grid-cols-4 items-center gap-4"
            >
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

interface WideCardsGridProps {
  idPrefix: string;
  minWidthClassName?: string;
}

function WideCardsGrid({
  idPrefix,
  minWidthClassName = 'min-w-[960px]',
}: WideCardsGridProps) {
  return (
    <div id={`${idPrefix}-scroll`} className="pb-2">
      <div
        id={`${idPrefix}-cards`}
        className={`grid ${minWidthClassName} grid-cols-3 gap-4`}
      >
        <Card id={`${idPrefix}-card-overview`} className="h-full">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Quick snapshot of the current workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul
              id={`${idPrefix}-overview-list`}
              className="space-y-2 text-sm text-muted-foreground"
            >
              <li>12 active projects</li>
              <li>4 items need attention</li>
              <li>Latest sync completed 2 minutes ago</li>
            </ul>
          </CardContent>
          <CardFooter className="justify-between border-t px-6 py-4 text-sm">
            <span className="text-muted-foreground">Updated just now</span>
            <Button size="sm" variant="outline">
              Inspect
            </Button>
          </CardFooter>
        </Card>
        <Card id={`${idPrefix}-card-performance`} className="h-full">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Trend lines and live health checks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div id={`${idPrefix}-performance`} className="space-y-3 text-sm">
              <p>Build success rate: 98%</p>
              <p>Median review time: 1.8 days</p>
              <p>Open alerts: 2</p>
            </div>
          </CardContent>
          <CardFooter className="justify-between border-t px-6 py-4 text-sm">
            <span className="text-muted-foreground">High confidence</span>
            <Button size="sm" variant="outline">
              Details
            </Button>
          </CardFooter>
        </Card>
        <Card id={`${idPrefix}-card-actions`} className="h-full">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Common follow-up actions for this view.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              id={`${idPrefix}-actions`}
              className="space-y-2 text-sm text-muted-foreground"
            >
              <p>Share the summary with your team.</p>
              <p>Export the current view as a report.</p>
              <p>Schedule a follow-up review.</p>
            </div>
          </CardContent>
          <CardFooter className="justify-between border-t px-6 py-4 text-sm">
            <span className="text-muted-foreground">Ready to act</span>
            <Button size="sm" variant="outline">
              Open
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface ResponsiveCardsGridProps {
  idPrefix: string;
}

const responsiveCardItems = [
  {
    title: 'Planning',
    description: 'Upcoming work and current priorities.',
    detail: '4 milestones',
  },
  {
    title: 'Design',
    description: 'Reviews, tokens, and component polish.',
    detail: '7 updates',
  },
  {
    title: 'Build',
    description: 'Implementation status across active projects.',
    detail: '12 tasks',
  },
  {
    title: 'QA',
    description: 'Manual checks and automated coverage.',
    detail: '3 blockers',
  },
  {
    title: 'Release',
    description: 'Version notes and deployment readiness.',
    detail: 'Ready',
  },
  {
    title: 'Follow-up',
    description: 'Team requests that need a response.',
    detail: '5 notes',
  },
];

function ResponsiveCardsGrid({ idPrefix }: ResponsiveCardsGridProps) {
  return (
    <div id={`${idPrefix}-cards`} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {responsiveCardItems.map((item) => (
        <Card id={`${idPrefix}-${item.title.toLowerCase()}`} key={item.title}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.detail}</p>
          </CardContent>
          <CardFooter className="justify-end border-t px-6 py-4">
            <Button size="sm" variant="outline">
              Review
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function ResponsiveCardsFlex({ idPrefix }: ResponsiveCardsGridProps) {
  return (
    <div id={`${idPrefix}-cards`} className="flex flex-wrap gap-4">
      {responsiveCardItems.map((item) => (
        <Card
          id={`${idPrefix}-${item.title.toLowerCase()}`}
          key={item.title}
          className="min-w-[220px] flex-[1_1_240px]"
        >
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.detail}</p>
          </CardContent>
          <CardFooter className="justify-end border-t px-6 py-4">
            <Button size="sm" variant="outline">
              Review
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function WideCardRowDialogStoryContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Wide Cards Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wide card row</DialogTitle>
          <DialogDescription>
            This story keeps multiple cards on one horizontal row to show a dialog layout
            that wants more width than the default examples.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <WideCardsGrid idPrefix="dialog-wide-row" />
        </DialogBody>
        <DialogFooter className="justify-between">
          <span id="dialog-span-1" className="text-sm text-muted-foreground">
            The row stays wide so the dialog feels like a dashboard rather than a form.
          </span>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dialog with several cards arranged in a row to demonstrate a wider content
 * area and horizontal layout.
 */
export const WideCardsRow: Story = {
  render: () => <WideCardRowDialogStoryContent />,
};

function RestrictedWidthDialogStoryContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Restricted Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[520px] sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Restricted width</DialogTitle>
          <DialogDescription>
            This story applies a max width so wide content scrolls inside the dialog body
            instead of expanding the modal.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <WideCardsGrid idPrefix="dialog-restricted-row" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dialog with a consumer-provided max width to demonstrate how to restrict
 * automatic content sizing.
 */
export const RestrictedWidth: Story = {
  render: () => <RestrictedWidthDialogStoryContent />,
};

function ResponsiveCardsDialogStoryContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Responsive Cards Dialog</Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[900px] sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Responsive cards</DialogTitle>
          <DialogDescription>
            Cards use normal responsive grid columns and stack inside DialogBody on
            smaller screens.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <ResponsiveCardsGrid idPrefix="dialog-responsive" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dialog body with responsive cards that stack on smaller viewports.
 */
export const ResponsiveCards: Story = {
  render: () => <ResponsiveCardsDialogStoryContent />,
};

function ResponsiveFlexCardsDialogStoryContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Flex Cards Dialog</Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[900px] sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Responsive flex cards</DialogTitle>
          <DialogDescription>
            Cards use flex wrapping so each card keeps a useful minimum width while
            filling the available row space.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <ResponsiveCardsFlex idPrefix="dialog-responsive-flex" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dialog body with responsive cards using flex wrapping rather than grid
 * breakpoints.
 */
export const ResponsiveFlexCards: Story = {
  render: () => <ResponsiveFlexCardsDialogStoryContent />,
};

function FullScreenDialogStoryContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Full Screen Dialog</Button>
      </DialogTrigger>
      <DialogContent fullscreen>
        <DialogHeader>
          <DialogTitle>Full screen workspace</DialogTitle>
          <DialogDescription>
            This story expands the dialog to the available viewport while keeping the
            header and footer fixed around a scrollable body.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div
            id="dialog-full-screen-layout"
            className="grid min-h-full gap-4 lg:grid-cols-[240px_1fr]"
          >
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Fullscreen dialog side panel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Active collection</p>
                  <p>3 pending reviews</p>
                  <p>12 synced records</p>
                </div>
              </CardContent>
            </Card>
            <WideCardsGrid idPrefix="dialog-full-screen-row" />
          </div>
        </DialogBody>
        <DialogFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            Fullscreen is opt-in through the DialogContent fullscreen prop.
          </span>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dialog expanded to nearly the full viewport.
 */
export const FullScreen: Story = {
  render: () => <FullScreenDialogStoryContent />,
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
    <div id="dialog-div-5" className="flex flex-col items-center gap-4">
      <p id="dialog-p-2" className="text-muted-foreground text-sm">
        {description}
      </p>
      {/* Container the dialog will be scoped to */}
      <div
        id="dialog-div-6"
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
              <p id="dialog-p-3" className="text-sm">
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

function WideDialogInsideContainerStoryContent() {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const containerRef = React.useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  return (
    <div id="dialog-container-wide-shell" className="flex flex-col items-center gap-4">
      <p
        id="dialog-container-wide-description"
        className="max-w-2xl text-sm text-muted-foreground"
      >
        The dialog portal mounts inside this box, fits within the box, and scrolls the
        body when the content is taller than the available height.
      </p>
      <div
        id="dialog-container-wide"
        ref={containerRef}
        className="relative flex h-[340px] w-[920px] max-w-[calc(100vw-2rem)] items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-4"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Wide Dialog In Container</Button>
          </DialogTrigger>
          <DialogContent container={container}>
            <DialogHeader>
              <DialogTitle>Container auto width</DialogTitle>
              <DialogDescription>
                The dialog expands inside the container and the body handles overflow
                without escaping the container boundary.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <WideCardsGrid
                  idPrefix="dialog-container-wide-row"
                  minWidthClassName="min-w-[760px]"
                />
                <ResponsiveCardsGrid idPrefix="dialog-container-responsive" />
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/**
 * Dialog using automatic content width while mounted inside a specific
 * container.
 */
export const InContainerAutoWidth: Story = {
  render: () => <WideDialogInsideContainerStoryContent />,
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

/**
 * Imperatively shown dialog registered with `dialog.register(...)` and opened
 * through its typed controller. Wrapped in a `DialogProvider`.
 */
export const RegisterViaProvider: Story = {
  decorators: [
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
  render: () => {
    const registeredDialog = React.useMemo(
      () =>
        dialog.register('storybook-registered-dialog', RegisteredStoryDialog, {
          title: 'Registered dialog',
        }),
      [],
    );

    return (
      <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
        <h3 className="text-lg font-semibold">Register Dialog</h3>
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
    );
  },
};

/**
 * Imperatively shown dialog built with `dialog.create(...)`, which owns the
 * NiceModal lifecycle and drives `useDialog()` itself. Wrapped in a
 * `DialogProvider`.
 */
export const CreateViaProvider: Story = {
  decorators: [
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
  render: () => (
    <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
      <h3 className="text-lg font-semibold">dialog.create</h3>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          data-slot="show-dialog"
          onClick={() => {
            customStoryDialog.show({
              description:
                'Use dialog.create when the component should call useDialog itself.',
            });
          }}
        >
          Custom show
        </Button>
        <Button
          data-slot="show-dialog-with-promise"
          onClick={() => {
            customStoryDialog.show({
              title: 'Custom dialog 2',
            });
          }}
        >
          Show dialog 2
        </Button>
      </div>
    </div>
  ),
};
