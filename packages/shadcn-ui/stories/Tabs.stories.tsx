import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/tabs';

/**
 * A customizable tabs component for organizing content into separate views.
 * Built on top of Radix UI Tabs primitive.
 */
const meta = {
  title: 'shadcn-ui/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The value of the tab that should be active when initially rendered',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the tabs',
    },
  },
  decorators: [
    (Story) => (
      <div className=" w-100">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default tabs with horizontal layout
 */
export const Default: Story = {
  args: {
    defaultValue: 'tab1',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Tab 1 Content</h3>
            <p>This is the content for the first tab.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Tab 2 Content</h3>
            <p>This is the content for the second tab.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab3">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Tab 3 Content</h3>
            <p>This is the content for the third tab.</p>
          </div>
        </TabsContent>
      </>
    ),
  },
};

/**
 * Vertical tabs layout
 */
export const Vertical: Story = {
  args: {
    defaultValue: 'tab1',
    orientation: 'vertical',
    children: (
      <div className="flex gap-4">
        <TabsList className="flex-col h-fit">
          <TabsTrigger value="tab1">Account</TabsTrigger>
          <TabsTrigger value="tab2">Password</TabsTrigger>
          <TabsTrigger value="tab3">Settings</TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="tab1">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Account Settings</h3>
              <p>Manage your account information here.</p>
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Password Settings</h3>
              <p>Change your password and security settings.</p>
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4">
              <h3 className="text-lg font-semibold">General Settings</h3>
              <p>Configure general application preferences.</p>
            </div>
          </TabsContent>
        </div>
      </div>
    ),
  },
};

/**
 * Tabs with icons
 */
export const WithIcons: Story = {
  args: {
    defaultValue: 'home',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="home">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </TabsTrigger>
          <TabsTrigger value="profile">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Home</h3>
            <p>Welcome to the home tab!</p>
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Profile</h3>
            <p>View and edit your profile information.</p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <p>Configure your application settings.</p>
          </div>
        </TabsContent>
      </>
    ),
  },
};

/**
 * Outline variant with more prominent borders
 */
export const Outline: Story = {
  args: {
    defaultValue: 'tab1',
    children: (
      <>
        <TabsList variant="outline">
          <TabsTrigger value="tab1">Overview</TabsTrigger>
          <TabsTrigger value="tab2">Analytics</TabsTrigger>
          <TabsTrigger value="tab3">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Overview</h3>
            <p>Get a high-level view of your data and metrics.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p>Detailed analytics and insights.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab3">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <p>Configure your preferences and options.</p>
          </div>
        </TabsContent>
      </>
    ),
  },
};

/**
 * Ghost variant with minimal styling
 */
export const Ghost: Story = {
  args: {
    defaultValue: 'tab1',
    children: (
      <>
        <TabsList variant="ghost">
          <TabsTrigger value="tab1">Dashboard</TabsTrigger>
          <TabsTrigger value="tab2">Projects</TabsTrigger>
          <TabsTrigger value="tab3">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Dashboard</h3>
            <p>Your personalized dashboard overview.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Projects</h3>
            <p>Manage and track your projects.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab3">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Team</h3>
            <p>Collaborate with your team members.</p>
          </div>
        </TabsContent>
      </>
    ),
  },
};

/**
 * Pill variant with rounded styling
 */
export const Pill: Story = {
  args: {
    defaultValue: 'tab1',
    children: (
      <>
        <TabsList variant="pill">
          <TabsTrigger value="tab1">Home</TabsTrigger>
          <TabsTrigger value="tab2">About</TabsTrigger>
          <TabsTrigger value="tab3">Contact</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Home</h3>
            <p>Welcome to our website.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="p-4">
            <h3 className="text-lg font-semibold">About</h3>
            <p>Learn more about our company and mission.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab3">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <p>Get in touch with us.</p>
          </div>
        </TabsContent>
      </>
    ),
  },
};

/**
 * Underline variant with bottom border styling
 */
export const Underline: Story = {
  args: {
    defaultValue: 'tab1',
    children: (
      <>
        <TabsList variant="underline">
          <TabsTrigger variant="underline" value="tab1">
            Account
          </TabsTrigger>
          <TabsTrigger variant="underline" value="tab2">
            Security
          </TabsTrigger>
          <TabsTrigger variant="underline" value="tab3">
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <p>Manage your account information and preferences.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <p>Configure your security and privacy options.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab3">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Notification Settings</h3>
            <p>Control how and when you receive notifications.</p>
          </div>
        </TabsContent>
      </>
    ),
  },
};
