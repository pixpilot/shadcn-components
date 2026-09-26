import type { Meta, StoryObj } from '@storybook/react';
import type { AuthFormsProps } from '../src/components/AuthForms';

import { useState } from 'react';

import { AuthForms } from '../src/components/AuthForms';

const action = async () => undefined;

function AuthFormsStory(args: AuthFormsProps) {
  const [error, setError] = useState(args.error);
  const [magicLinkSentTo, setMagicLinkSentTo] = useState(args.magicLinkSentTo ?? null);
  const [emailOtpSentTo, setEmailOtpSentTo] = useState(args.emailOtpSentTo ?? null);
  const [resetPasswordSentTo, setResetPasswordSentTo] = useState(
    args.resetPasswordSentTo ?? null,
  );
  const [signupConfirmationSentTo, setSignupConfirmationSentTo] = useState(
    args.signupConfirmationSentTo ?? null,
  );

  return (
    <AuthForms
      {...args}
      error={error}
      magicLinkSentTo={magicLinkSentTo}
      emailOtpSentTo={emailOtpSentTo}
      resetPasswordSentTo={resetPasswordSentTo}
      signupConfirmationSentTo={signupConfirmationSentTo}
      onSendMagicLink={
        args.onSendMagicLink == null
          ? undefined
          : async (email) => {
              await args.onSendMagicLink?.(email);
              setMagicLinkSentTo(email);
            }
      }
      onSendEmailOtp={
        args.onSendEmailOtp == null
          ? undefined
          : async (email) => {
              await args.onSendEmailOtp?.(email);
              setEmailOtpSentTo(email);
            }
      }
      onResetPassword={
        args.onResetPassword == null
          ? undefined
          : async (email) => {
              await args.onResetPassword?.(email);
              setResetPasswordSentTo(email);
            }
      }
      onSignUp={
        args.onSignUp == null
          ? undefined
          : async (email, password) => {
              await args.onSignUp?.(email, password);
              setSignupConfirmationSentTo(email);
            }
      }
      onModeChange={(mode) => {
        setError(null);
        setMagicLinkSentTo(null);
        setEmailOtpSentTo(null);
        setResetPasswordSentTo(null);
        setSignupConfirmationSentTo(null);
        args.onModeChange?.(mode);
      }}
    />
  );
}

const meta = {
  title: 'shadcn-auth/AuthForms',
  component: AuthForms,
  render: (args) => <AuthFormsStory {...args} />,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'Your account',
    isLoading: false,
    error: null,
    onSignIn: action,
    onSignUp: action,
    onResetPassword: action,
    onGoogleSignIn: action,
    onLinkedInSignIn: action,
  },
} satisfies Meta<typeof AuthForms>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {};

export const SignInError: Story = {
  args: { error: 'Invalid email or password. Please try again.' },
};

export const SignUp: Story = {
  args: {
    initialMode: 'signup',
    privacyNotice: (
      <>
        We process your data to provide the service, as described in our{' '}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Privacy Policy
        </a>
        . We do not send marketing email and do not use tracking or advertising cookies.
      </>
    ),
  },
};

export const SignUpConfirmation: Story = {
  args: {
    initialMode: 'signup',
    signupConfirmationSentTo: 'ada@example.com',
  },
};

export const ResetPassword: Story = {
  args: { initialMode: 'reset' },
};

export const MagicLink: Story = {
  args: {
    initialMode: 'magic-link',
    onSendMagicLink: action,
  },
};

export const MagicLinkSent: Story = {
  args: {
    initialMode: 'magic-link',
    onSendMagicLink: action,
    magicLinkSentTo: 'ada@example.com',
  },
};

export const EmailCode: Story = {
  args: {
    initialMode: 'email-otp',
    onSendEmailOtp: action,
    onVerifyEmailOtp: action,
  },
};

export const EmailCodeEntry: Story = {
  args: {
    initialMode: 'email-otp',
    onSendEmailOtp: action,
    onVerifyEmailOtp: action,
    emailOtpSentTo: 'ada@example.com',
    emailOtpExpiryMinutes: 15,
  },
};

export const ProviderOnly: Story = {
  args: {
    onSignIn: undefined,
    onSignUp: undefined,
    onResetPassword: undefined,
  },
};
