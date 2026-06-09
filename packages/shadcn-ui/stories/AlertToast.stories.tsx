import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Button } from '../src/Button';
import { toast, Toaster } from '../src/toast';
import { AlertToast } from '../src/toast/AlertToast';

/**
 * AlertToast component for displaying toast notifications with different variants.
 *
 * ## Usage
 * To use the toast in your application:
 *
 * 1. Make sure you have the `<Toaster />` component from 'sonner' in your app layout/root
 * 2. Import the toast functions: `toast`, `toast.info`, `toast.success`, `toast.warning`, `toast.error`, `toast.custom`
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
 *
 * // Or use custom components
 * toast.custom(
 *   <div className="flex items-center gap-2">
 *     <span>🚀</span>
 *     <div>
 *       <div className="font-semibold">Custom Toast!</div>
 *       <div className="text-sm">Fully customizable content</div>
 *     </div>
 *   </div>,
 *   { duration: 5000, id: 'my-custom-toast' }
 * );
 * ```
 */
type StoryArgs = Partial<
  ComponentProps<typeof Button> & {
    id?: string;
  }
>;

const meta: Meta<StoryArgs> = {
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
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast with info variant.
 * Click the button to trigger the toast notification.
 */
export const Default: Story = {
  render: () => (
    <Button
      id="alert-toast-button-1"
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

export const AlertToastComponent: React.FC = () => {
  return (
    <AlertToast
      title="Alert Toast"
      description="This is an example of the AlertToast component"
      variant="success"
      icon
      onClose={() => {}}
    />
  );
};

/**
 * Info toast for informational messages.
 * Use `toast.info()` helper for quick info messages.
 */
export const Info: Story = {
  render: () => (
    <div id="alert-toast-div-1" className="flex flex-col gap-2">
      <Button
        id="alert-toast-button-2"
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
        id="alert-toast-button-3"
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
    <div id="alert-toast-div-2" className="flex flex-col gap-2">
      <Button
        id="alert-toast-button-4"
        onClick={() =>
          toast.success({
            title: 'Success!',
            description: 'Your changes have been saved successfully.',
          })
        }
      >
        Show Success Toast
      </Button>
      <Button
        id="alert-toast-button-5"
        variant="outline"
        onClick={() => toast.success('Operation completed!')}
      >
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
    <div id="alert-toast-div-3" className="flex flex-col gap-2">
      <Button
        id="alert-toast-button-6"
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
        id="alert-toast-button-7"
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
    <div id="alert-toast-div-4" className="flex flex-col gap-2">
      <Button
        id="alert-toast-button-8"
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
      <Button
        id="alert-toast-button-9"
        variant="outline"
        onClick={() => toast.error('An error occurred!')}
      >
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
    <div id="alert-toast-div-5" className="flex flex-col gap-2">
      <Button
        id="alert-toast-button-10"
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
        id="alert-toast-button-11"
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
 * Non-dismissible toast example.
 * Set `dismissible: false` to prevent manual dismissal.
 */
export const DismissibleFalse: Story = {
  render: () => (
    <Button
      id="alert-toast-button-12"
      onClick={() =>
        toast({
          title: 'Non-dismissible Toast',
          description: 'This toast cannot be dismissed manually.',
          dismissible: false,
          position: 'bottom-center',
        })
      }
    >
      Show Non-dismissible Toast
    </Button>
  ),
};

/**
 * Custom toast with React components.
 * Use `toast.custom()` to render custom React components in toasts.
 * This allows for fully customized toast content beyond the standard variants.
 */
export const CustomToast: Story = {
  render: () => (
    <div id="alert-toast-div-6" className="flex flex-col gap-2">
      <Button
        id="alert-toast-button-13"
        onClick={() =>
          toast.custom(
            <div id="alert-toast-div-7" className="flex items-center gap-2">
              <span id="alert-toast-span-1" className="text-2xl">
                🚀
              </span>
              <div id="alert-toast-div-8">
                <div id="alert-toast-div-9" className="font-semibold">
                  Custom Toast!
                </div>
                <div id="alert-toast-div-10" className="text-sm opacity-90">
                  This is a fully custom toast component
                </div>
              </div>
            </div>,
            { duration: 5000 },
          )
        }
      >
        Show Custom Toast
      </Button>
      <Button
        id="alert-toast-button-14"
        variant="outline"
        onClick={() =>
          toast.custom(
            <div
              id="alert-toast-div-11"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg"
            >
              <div id="alert-toast-div-12" className="font-bold text-lg">
                🎨 Styled Toast
              </div>
              <div id="alert-toast-div-13" className="text-sm">
                With custom styling and colors
              </div>
            </div>,
            { duration: 7000, id: 'styled-toast' },
          )
        }
      >
        Show Styled Custom Toast
      </Button>
      <Button
        id="alert-toast-button-15"
        variant="secondary"
        onClick={() => {
          // Show multiple custom toasts with same ID to demonstrate replacement
          toast.custom(
            <div id="alert-toast-div-14" className="flex items-center gap-2">
              <span id="alert-toast-span-2" className="text-xl">
                🔄
              </span>
              <div id="alert-toast-div-15">
                <div id="alert-toast-div-16" className="font-semibold">
                  First Version
                </div>
                <div id="alert-toast-div-17" className="text-sm opacity-90">
                  This will be replaced
                </div>
              </div>
            </div>,
            { id: 'replace-demo', duration: 3000 },
          );
          setTimeout(() => {
            toast.custom(
              <div id="alert-toast-div-18" className="flex items-center gap-2">
                <span id="alert-toast-span-3" className="text-xl">
                  ✨
                </span>
                <div id="alert-toast-div-19">
                  <div id="alert-toast-div-20" className="font-semibold">
                    Updated Version
                  </div>
                  <div id="alert-toast-div-21" className="text-sm opacity-90">
                    This replaced the previous one
                  </div>
                </div>
              </div>,
              { id: 'replace-demo', duration: 3000 },
            );
          }, 1000);
        }}
      >
        Show Replacing Custom Toasts
      </Button>
    </div>
  ),
};

/**
 * Position story
 * Demonstrates different `Toaster` positions. Select a position and click the button to show the toast.
 */
function PositionStory() {
  const [position, setPosition] = useState<
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
  >('top-right');

  return (
    <div id="alert-toast-div-22" className="flex flex-col items-center gap-4">
      <Toaster position={position} />
      <div id="alert-toast-div-23" className="flex items-center gap-2">
        <p id="alert-toast-p-1" className="mr-2">
          Position:
        </p>
        <select
          id="alert-toast-select-1"
          value={position}
          // eslint-disable-next-line ts/no-unsafe-argument
          onChange={(e) => setPosition(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option id="alert-toast-option-1" value="top-left">
            Top Left
          </option>
          <option id="alert-toast-option-2" value="top-center">
            Top Center
          </option>
          <option id="alert-toast-option-3" value="top-right">
            Top Right
          </option>
          <option id="alert-toast-option-4" value="bottom-left">
            Bottom Left
          </option>
          <option id="alert-toast-option-5" value="bottom-center">
            Bottom Center
          </option>
          <option id="alert-toast-option-6" value="bottom-right">
            Bottom Right
          </option>
        </select>
        <Button
          id="alert-toast-button-16"
          onClick={() =>
            toast({
              title: 'Positioned toast',
              description: `This toast uses the "${position}" toaster position.`,
              position,
            })
          }
        >
          Show Toast
        </Button>
      </div>
    </div>
  );
}

export const Position: Story = {
  render: PositionStory,
};

function IdRemoveStory() {
  const [lastId, setLastId] = useState<string | null>(null);
  const [returnedIds, setReturnedIds] = useState<string[]>([]);
  const fixedId = 'removable-toast';

  const addReturnedId = (id: string) => {
    setReturnedIds((prev) => [...prev.slice(-4), id]); // Keep last 5 IDs
  };

  return (
    <div id="alert-toast-div-24" className="flex flex-col gap-4">
      <div id="alert-toast-div-25" className="text-sm text-gray-600">
        Returned IDs: {returnedIds.length > 0 ? returnedIds.join(', ') : 'None'}
      </div>

      <div id="alert-toast-div-26" className="flex flex-col gap-2">
        <Button
          id="alert-toast-button-17"
          onClick={() => {
            const id = toast({
              id: fixedId,
              variant: 'info',
              title: 'Removable Toast',
              description:
                'This toast was created with an id and can be removed programmatically.',
            });
            setLastId(id);
            addReturnedId(id);
          }}
        >
          Show Toast With ID
        </Button>

        <Button
          id="alert-toast-button-18"
          variant="secondary"
          onClick={() => toast.dismiss(fixedId)}
        >
          Remove Toast By ID
        </Button>

        <Button
          id="alert-toast-button-19"
          variant="outline"
          onClick={() => {
            const gen = `custom-${Math.random().toString(36).slice(2, 8)}`;
            const id = toast.custom(
              <div id="alert-toast-div-27" className="p-2">
                Custom toast id: {gen}
              </div>,
              {
                id: gen,
                duration: 5000,
              },
            );
            setLastId(id as string);
            addReturnedId(id as string);
          }}
        >
          Show Custom Toast With ID
        </Button>

        <Button
          id="alert-toast-button-20"
          variant="destructive"
          onClick={() => lastId != null && toast.dismiss(lastId)}
        >
          Remove Last Shown Toast
        </Button>

        <Button
          id="alert-toast-button-21"
          onClick={() => {
            const id = toast.success('Success message with returned ID');
            addReturnedId(id);
          }}
        >
          Show Success With Returned ID
        </Button>
      </div>
    </div>
  );
}

export const PassIdAndRemove: Story = {
  render: IdRemoveStory,
};
