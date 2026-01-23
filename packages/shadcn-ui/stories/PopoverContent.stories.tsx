import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../src/popover';

/**
 * A styled popover content component with responsive width constraints.
 * Used as the content container for popover overlays.
 */
const meta = {
  title: 'shadcn-ui/PopoverContent',
  component: PopoverContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A custom styled PopoverContent with responsive max-width and transparent background.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * PopoverContent with sample content
 */
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <h3 className="font-semibold">Popover Title</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This is the content inside the popover. It has custom styling with responsive
            width.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * PopoverContent with form content
 */
export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Edit Profile</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4 w-80">
          <h3 className="font-semibold mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium">Name</span>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter your email"
              />
            </div>
            <Button className="w-full">Save Changes</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Long Content Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4  overflow-y-auto w-100">
          <h3 className="font-semibold mb-4">Long Content</h3>

          {Array.from({ length: 20 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={index} className="text-sm text-muted-foreground mb-2">
              This is line {index + 1} of the long content inside the popover. It
              demonstrates how the popover handles overflow and scrolling behavior when
              the content exceeds the maximum height.
            </p>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ),
};
