import type { Meta, StoryObj } from '@storybook/react';
import { SignInForm } from '../src/SignInForm';

/**
 * Sign-in form component with email/password and Google OAuth support.
 * Includes validation and error handling.
 */
const meta = {
  title: 'shadcn-auth/SignInForm',
  component: SignInForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Loading state of the form',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
  args: {
    onSignIn: async () => {},
    onGoogleSignIn: async () => {},
    onSwitchToSignUp: () => {},
    onSwitchToReset: () => {},
  },
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default sign-in form ready for user input
 */
export const Default: Story = {
  args: {
    isLoading: false,
    error: null,
  },
};

/**
 * Sign-in form in loading state
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    error: null,
  },
};

/**
 * Sign-in form displaying an error message
 */
export const WithError: Story = {
  args: {
    isLoading: false,
    error: 'Invalid email or password. Please try again.',
  },
};

/**
 * Sign-in form with network error
 */
export const NetworkError: Story = {
  args: {
    isLoading: false,
    error: 'Network error. Please check your connection and try again.',
  },
};

/**
 * Sign-in form without Google OAuth option
 */
export const WithoutGoogleSignIn: Story = {
  args: {
    isLoading: false,
    error: null,
    onGoogleSignIn: undefined,
  },
};
