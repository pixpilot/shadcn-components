import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../src/card';

/**
 * Card primitives for grouping related content and actions.
 */
const meta = {
  title: 'shadcn-ui/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Card body content or composed card sections',
    },
    className: {
      control: 'text',
      description: 'Additional classes for the card root',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card root with plain children.
 */
export const Default: Story = {
  args: {
    className: 'w-[360px]',
    children: <p id="card-p-1">Use Card to frame related content.</p>,
  },
};

/**
 * Card with header and title slots.
 */
export const WithHeader: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <CardHeader>
        <CardTitle>Project status</CardTitle>
      </CardHeader>
    ),
  },
};

/**
 * Card header with title and description.
 */
export const WithDescription: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <CardHeader>
        <CardTitle>Deployment ready</CardTitle>
        <CardDescription>All checks passed and the preview is available.</CardDescription>
      </CardHeader>
    ),
  },
};

/**
 * Card header with a right-aligned action slot.
 */
export const WithAction: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Manage collaborators for this workspace.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </CardAction>
      </CardHeader>
    ),
  },
};

/**
 * Card with the padded content slot.
 */
export const WithContent: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <CardContent>
        <div id="card-div-1" className="space-y-2 text-sm">
          <p id="card-p-2">CardContent applies responsive horizontal padding.</p>
          <p id="card-p-3" className="text-muted-foreground">
            Place copy, forms, media, or custom layouts inside this section.
          </p>
        </div>
      </CardContent>
    ),
  },
};

/**
 * Card with footer actions.
 */
export const WithFooter: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    ),
  },
};

/**
 * Full composition using every exported card section.
 */
export const CompleteCard: Story = {
  args: {
    className: 'w-[420px]',
    children: (
      <>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan renews on July 1.</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl id="card-dl-1" className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Plan</dt>
            <dd className="text-right font-medium">Pro</dd>
            <dt className="text-muted-foreground">Seats</dt>
            <dd className="text-right font-medium">8 of 10</dd>
            <dt className="text-muted-foreground">Storage</dt>
            <dd className="text-right font-medium">72 GB</dd>
          </dl>
        </CardContent>
        <CardFooter className="justify-between border-t text-sm">
          <span className="text-muted-foreground">Billing is up to date.</span>
          <Button size="sm">Upgrade</Button>
        </CardFooter>
      </>
    ),
  },
};
