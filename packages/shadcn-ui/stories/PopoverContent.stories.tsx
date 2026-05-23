import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/Button';
import { Popover, PopoverContentUnstyled, PopoverTrigger } from '../src/popover';

/**
 * A styled popover content component with responsive width constraints.
 * Used as the content container for popover overlays.
 */
const meta = {
  title: 'shadcn-ui/PopoverContent',
  component: PopoverContentUnstyled,
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
} satisfies Meta<typeof PopoverContentUnstyled>;

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
      <PopoverContentUnstyled>
        <div id="popover-content-div-1" className="p-4">
          <h3 id="popover-content-h3-1" className="font-semibold">
            Popover Title
          </h3>
          <p id="popover-content-p-1" className="text-sm text-muted-foreground mt-2">
            This is the content inside the popover. It has custom styling with responsive
            width.
          </p>
        </div>
      </PopoverContentUnstyled>
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
      <PopoverContentUnstyled>
        <div id="popover-content-div-2" className="p-4 w-80">
          <h3 id="popover-content-h3-2" className="font-semibold mb-4">
            Edit Profile
          </h3>
          <div id="popover-content-div-3" className="space-y-4">
            <div id="popover-content-div-4">
              <span id="popover-content-span-1" className="text-sm font-medium">
                Name
              </span>
              <input
                id="popover-content-input-1"
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter your name"
              />
            </div>
            <div id="popover-content-div-5">
              <span id="popover-content-span-2" className="text-sm font-medium">
                Email
              </span>
              <input
                id="popover-content-input-2"
                type="email"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter your email"
              />
            </div>
            <Button className="w-full">Save Changes</Button>
          </div>
        </div>
      </PopoverContentUnstyled>
    </Popover>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Long Content Popover</Button>
      </PopoverTrigger>
      <PopoverContentUnstyled>
        <div id="popover-content-div-6" className="p-4  overflow-y-auto w-100">
          <h3 id="popover-content-h3-3" className="font-semibold mb-4">
            Long Content
          </h3>

          {Array.from({ length: 20 }, (_, index) => index + 1).map((lineNumber) => (
            <p
              id="popover-content-p-2"
              key={lineNumber}
              className="text-sm text-muted-foreground mb-2"
            >
              This is line {lineNumber} of the long content inside the popover. It
              demonstrates how the popover handles overflow and scrolling behavior when
              the content exceeds the maximum height.
            </p>
          ))}
        </div>
      </PopoverContentUnstyled>
    </Popover>
  ),
};
