/* eslint-disable ts/no-floating-promises */
/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { cn, Label } from '@pixpilot/shadcn';
import * as React from 'react';
import { Button } from '../src/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../src/drawer';
import { drawer, useDrawer } from '../src/drawer-registry';
import { OverlayProvider } from '../src/overlay-provider';

// --- Provider-driven (imperative) drawers ---
// These demonstrate the drawer-registry (registerDrawer / drawer.create)
// alongside the declarative examples, so every Drawer story lives in one place.

type RegisteredStoryDrawerProps = ComponentProps<typeof Drawer> & {
  description?: string;
  title?: string;
};

function RegisteredStoryDrawer({
  description = 'This is a registered drawer component. It can be shown using drawer.show(...) or the typed controller returned by drawer.register(...).',
  title = 'Registered Drawer',
  ...drawerProps
}: RegisteredStoryDrawerProps) {
  return (
    <Drawer {...drawerProps}>
      <DrawerContent floating className="sm:mx-auto sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle data-slot="drawer-title">{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>{description}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

interface CustomStoryDrawerProps {
  description?: string;
  title?: string;
}

const customStoryDrawer = drawer.create<CustomStoryDrawerProps>(
  ({
    description = 'This drawer was created with drawer.create(...), so it owns the NiceModal lifecycle directly.',
    title = 'Custom Drawer',
  }) => {
    const modal = useDrawer();

    const handleClose = (result: string) => {
      modal.resolve(result);
      modal.hide();
    };

    return (
      <Drawer
        open={modal.visible}
        direction="right"
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose('Closed');
          }
        }}
      >
        <DrawerContent floating>
          <DrawerHeader>
            <DrawerTitle data-slot="drawer-title">{title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>{description}</DrawerBody>
          <div className="flex justify-end">
            <Button id="close-drawer" onClick={() => handleClose('Done')}>
              Done
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
);

/**
 * An edge-anchored overlay ("drawer"). Pulled from the shadcn registry — built
 * on `vaul` (which wraps the Radix Dialog primitive), so it keeps the smooth
 * spring animation, drag-to-dismiss, and blurred backdrop. The anchored edge is
 * set with the `direction` prop on the `Drawer` root.
 */
const meta = {
  title: 'shadcn-ui/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

interface DeliveryOption {
  label: string;
  detail: string;
  badge?: string;
}

const deliveryOptions: DeliveryOption[] = [
  {
    label: 'Standard delivery',
    detail: '25–35 min · Driver assigned now',
    badge: 'Fastest',
  },
  { label: '5:00 PM – 5:15 PM', detail: 'Prep starts at 4:45 PM' },
  { label: '5:30 PM – 5:45 PM', detail: "Good if you're heading home" },
  { label: '6:00 PM – 6:15 PM', detail: 'Most popular · High demand' },
  { label: '6:30 PM – 6:45 PM', detail: 'Last slot before kitchen closes' },
];

function DeliveryTimeDrawer() {
  const [selected, setSelected] = React.useState(0);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Pick a delivery time</Button>
      </DrawerTrigger>
      <DrawerContent floating className="sm:mx-auto sm:max-w-md">
        <DrawerHeader className="md:text-left">
          <DrawerTitle className="text-lg">Pick a delivery time</DrawerTitle>
          <DrawerDescription data-slot="drawer-description" className="text-sm">
            We'll prepare your order as soon as possible.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-2 py-2">
            {deliveryOptions.map((option, index) => {
              const isSelected = selected === index;
              return (
                <button
                  type="button"
                  key={option.label}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(index)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                    isSelected
                      ? 'border-foreground/40 bg-accent'
                      : 'border-transparent bg-muted/40 hover:bg-muted',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{option.label}</span>
                      {option.badge != null && (
                        <span className="bg-background text-muted-foreground rounded-full border px-2 py-0.5 text-xs font-medium">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{option.detail}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full border',
                      isSelected ? 'border-foreground' : 'border-muted-foreground/40',
                    )}
                  >
                    {isSelected && <span className="bg-foreground size-2 rounded-full" />}
                  </span>
                </button>
              );
            })}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="rounded-full">Confirm Delivery Time</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="ghost" className="rounded-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * A bottom drawer styled as a selectable option list with a blurred backdrop and
 * the smooth vaul spring animation.
 */
export const Default: Story = {
  render: () => <DeliveryTimeDrawer />,
};

/**
 * A drawer anchored to the top edge via `direction="top"`.
 */
export const Top: Story = {
  render: () => (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Top Drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="sm:mx-auto sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>Slides in from the top edge.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">You have 3 unread notifications.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * A drawer anchored to a horizontal edge (side panel) via `direction="right"`.
 * The drag handle only shows for the bottom direction.
 */
export const RightPanel: Story = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Right Panel</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>A side panel drawer.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Panel content goes here.</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * A drawer with long content to demonstrate the scrollable body while the
 * header and footer stay put.
 */
export const LongContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Long Drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="sm:mx-auto sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Long Drawer Example</DrawerTitle>
          <DrawerDescription>
            The body scrolls when the content is taller than the drawer.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          {Array.from({ length: 40 }, (_, i) => (
            <div key={i} className="grid gap-2 py-1">
              <Label htmlFor={`drawer-field-${i}`}>Field {i + 1}</Label>
              <input
                id={`drawer-field-${i}`}
                defaultValue={`Sample value for field ${i + 1}.`}
              />
            </div>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <Button type="submit">Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Imperatively shown drawer registered with `drawer.register(...)` and opened
 * through its typed controller. Wrapped in a `DrawerProvider`.
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
    const registeredDrawer = React.useMemo(
      () =>
        drawer.register('storybook-registered-drawer', RegisteredStoryDrawer, {
          title: 'Registered drawer',
        }),
      [],
    );

    return (
      <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg border bg-background p-6 text-center shadow-sm">
        <h3 className="text-lg font-semibold">Register Drawer</h3>
        <Button
          data-slot="show-registered-drawer"
          onClick={() => {
            registeredDrawer.show({
              description:
                'registerDrawer now injects open and onOpenChange automatically.',
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
 * Imperatively shown drawer built with `drawer.create(...)`, which owns the
 * NiceModal lifecycle and drives `useDrawer()` itself (here as a right-side
 * drawer). Wrapped in a `DrawerProvider`.
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
      <h3 className="text-lg font-semibold">drawer.create</h3>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          data-slot="show-drawer"
          onClick={() => {
            customStoryDrawer.show({
              description:
                'Use drawer.create when the component should call useDrawer itself.',
            });
          }}
        >
          Custom show
        </Button>
        <Button
          data-slot="show-drawer-with-promise"
          onClick={() => {
            customStoryDrawer.show({
              title: 'Custom drawer 2',
            });
          }}
        >
          Show drawer 2
        </Button>
      </div>
    </div>
  ),
};
