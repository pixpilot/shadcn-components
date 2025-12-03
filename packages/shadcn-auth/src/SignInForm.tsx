'use client';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  OrContinueWithSeparator,
  Separator,
} from '@pixpilot/shadcn';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { GoogleSignIn } from './GoogleSignIn';

interface SignInFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onSwitchToSignUp?: () => void;
  onSwitchToReset?: () => void;
}

const MIN_PASSWORD_LENGTH = 6;

export function SignInForm({
  onSignIn,
  onGoogleSignIn,
  isLoading,
  error,
  onSwitchToSignUp,
  onSwitchToReset,
}: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const validatePassword = (passwordValue: string): boolean => {
    if (!passwordValue.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (passwordValue.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;

    onSignIn(email, password).catch(console.error);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="p-6">
        <h2 className="mb-4 text-center text-2xl font-bold">Sign In</h2>

        {error != null && error.trim() !== '' && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
              className={emailError ? 'border-destructive' : ''}
            />
            {emailError && <p className="text-destructive text-sm">{emailError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              disabled={isLoading}
              required
              className={passwordError ? 'border-destructive' : ''}
            />
            {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {onGoogleSignIn != null && (
          <>
            <OrContinueWithSeparator />
            <GoogleSignIn onGoogleSignIn={onGoogleSignIn} isLoading={isLoading} />
          </>
        )}

        <Separator className="my-4" />

        <div className="space-y-2 text-center text-sm">
          {onSwitchToSignUp && (
            <p>
              Don't have an account?{' '}
              <Button
                variant="link"
                size="sm"
                onClick={onSwitchToSignUp}
                disabled={isLoading}
                className="h-auto p-0"
              >
                Sign up
              </Button>
            </p>
          )}
          {onSwitchToReset && (
            <p>
              <Button
                variant="link"
                size="sm"
                onClick={onSwitchToReset}
                disabled={isLoading}
                className="h-auto p-0"
              >
                Forgot your password?
              </Button>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
