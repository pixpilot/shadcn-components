import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger } from '@internal/shadcn';
import { Button } from '../src/Button';
import { PopoverContent } from '../src/PopoverContent';

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
