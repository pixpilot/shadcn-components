'use client';
import { Button, Card, CardContent, Input, Label } from '@pixpilot/shadcn';
import { Alert } from '@pixpilot/shadcn-ui';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface ResetPasswordFormProps {
  onResetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onSwitchToSignIn?: () => void;
}

export function ResetPasswordForm({
  onResetPassword,
  isLoading,
  error,
  onSwitchToSignIn,
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setEmailError('Email is required');
      return false;
    }
    // Use browser's built-in email validation
    const input = document.createElement('input');
    input.type = 'email';
    input.value = emailValue;
    if (!input.validity.valid) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    onResetPassword(email).catch(console.error);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="p-6">
        <h2 className="mb-4 text-center text-2xl font-bold">Reset Password</h2>

        {error != null && error.trim() !== '' && (
          <Alert variant="error" description={error}></Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              disabled={isLoading}
              required
            />
            {emailError && <p className="text-destructive text-sm">{emailError}</p>}
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          {onSwitchToSignIn && (
            <p className="text-sm">
              <Button
                variant="link"
                size="sm"
                onClick={onSwitchToSignIn}
                disabled={isLoading}
                className="min-w-0 p-0 font-medium"
              >
                Back to sign in
              </Button>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
