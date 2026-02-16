import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/Button';
import { toast, Toaster } from '../src/toast';

/**
 * AlertToast component for displaying toast notifications with different variants.
 *
 * ## Usage
 * To use the toast in your application:
 *
 * 1. Make sure you have the `<Toaster />` component from 'sonner' in your app layout/root
 * 2. Import the toast functions: `toast`, `toast.info`, `toast.success`, `toast.warning`, `toast.error`
 * 3. Call the appropriate function to show a toast notification
 *
 * @example
 * ```tsx
 * import { Toaster } from 'sonner';
 * import { toast } from '@pixpilot/shadcn-ui';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourContent />
 *       <Toaster />
 *     </>
 *   );
 * }
 *
 * // Show a toast notification
 * toast({
 *   variant: 'info',
 *   title: 'Information',
 *   description: 'This is an informational message',
 *   duration: 5000, // optional, defaults to 10000ms
 * });
 *
 * // Or use the convenience methods
 * toast.success('Operation completed successfully');
 * toast.error({ title: 'Error', description: 'Something went wrong' });
 * ```
 */
const meta = {
  title: 'shadcn-ui/AlertToast',
  component: Button, // Using Button as the primary component since AlertToast is rendered programmatically
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Toaster />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast with info variant.
 * Click the button to trigger the toast notification.
 */
export const Default: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast({
          variant: 'info',
          title: 'Heads up!',
          description: 'You can add components to your app using the cli.',
        })
      }
    >
      Show Default Toast
    </Button>
  ),
};

/**
 * Info toast for informational messages.
 * Use `toast.info()` helper for quick info messages.
 */
export const Info: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast.info({
            title: 'Information',
            description: 'Here is some helpful information about this feature.',
          })
        }
      >
        Show Info Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('This is a simple info message')}
      >
        Show Simple Info
      </Button>
    </div>
  ),
};

/**
 * Success toast for positive feedback.
 * Use `toast.success()` for successful operations.
 */
export const Success: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast.success({
            title: 'Success!',
            description: 'Your changes have been saved successfully.',
          })
        }
      >
        Show Success Toast
      </Button>
      <Button variant="outline" onClick={() => toast.success('Operation completed!')}>
        Show Simple Success
      </Button>
    </div>
  ),
};

/**
 * Warning toast for cautionary messages.
 * Use `toast.warning()` for warnings and cautions.
 */
export const Warning: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast.warning({
            title: 'Warning',
            description: 'This action may have unintended consequences.',
          })
        }
      >
        Show Warning Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Please review before proceeding')}
      >
        Show Simple Warning
      </Button>
    </div>
  ),
};

/**
 * Error toast for critical messages.
 * Use `toast.error()` for error notifications.
 */
export const Error: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button
        variant="destructive"
        onClick={() =>
          toast.error({
            title: 'Error',
            description: 'Something went wrong. Please try again later.',
          })
        }
      >
        Show Error Toast
      </Button>
      <Button variant="outline" onClick={() => toast.error('An error occurred!')}>
        Show Simple Error
      </Button>
    </div>
  ),
};

/**
 * Custom duration example.
 * Control how long the toast stays visible (in milliseconds).
 */
export const CustomDuration: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast({
            variant: 'info',
            title: 'Short Duration',
            description: 'This toast will disappear after 2 seconds',
            duration: 2000,
          })
        }
      >
        Show 2s Toast
      </Button>
      <Button
        onClick={() =>
          toast({
            variant: 'success',
            title: 'Long Duration',
            description: 'This toast will stay for 15 seconds',
            duration: 15000,
          })
        }
      >
        Show 15s Toast
      </Button>
    </div>
  ),
};

/**
 * Multiple toasts example.
 * You can show multiple toasts at once, and they will stack.
 * Duplicate toasts (same title and description) will replace the previous one.
 */
export const MultipleToasts: Story = {
  render: () => {
    const SECOND_TOAST_DELAY = 200;
    const THIRD_TOAST_DELAY = 400;
    const DUPLICATE_FIRST_DELAY = 500;
    const DUPLICATE_SECOND_DELAY = 1000;

    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            toast.success('First toast');
            setTimeout(() => toast.info('Second toast'), SECOND_TOAST_DELAY);
            setTimeout(() => toast.warning('Third toast'), THIRD_TOAST_DELAY);
          }}
        >
          Show Multiple Different Toasts
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            toast.info('Duplicate message');
            setTimeout(() => toast.info('Duplicate message'), DUPLICATE_FIRST_DELAY);
            setTimeout(() => toast.info('Duplicate message'), DUPLICATE_SECOND_DELAY);
          }}
        >
          Show Duplicate Toasts (Will Replace)
        </Button>
      </div>
    );
  },
};
