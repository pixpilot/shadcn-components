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

interface SignUpFormProps {
  onSignUp: (email: string, password: string) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onSwitchToSignIn?: () => void;
}

const MIN_PASSWORD_LENGTH = 6;

export function SignUpForm({
  onSignUp,
  onGoogleSignIn,
  isLoading,
  error,
  onSwitchToSignIn,
}: SignUpFormProps) {
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

    onSignUp(email, password).catch(console.error);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="p-6">
        <h2 className="mb-4 text-center text-2xl font-bold">Sign Up</h2>

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
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>

        {onGoogleSignIn != null && (
          <>
            <OrContinueWithSeparator />
            <GoogleSignIn onGoogleSignIn={onGoogleSignIn} isLoading={isLoading} />
          </>
        )}

        <Separator className="my-4" />

        <div className="text-center text-sm">
          {onSwitchToSignIn && (
            <p>
              Already have an account?{' '}
              <Button
                variant="link"
                size="sm"
                onClick={onSwitchToSignIn}
                disabled={isLoading}
                className="h-auto p-0"
              >
                Sign in
              </Button>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
