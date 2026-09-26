'use client';

import type React from 'react';

import { Alert, AlertDescription, Card, CardContent } from '@pixpilot/shadcn';

export interface AuthCardProps {
  /** Heading for the step, e.g. "Sign In". */
  title: string;
  /** Optional line under the heading explaining what happens next. */
  description?: React.ReactNode;
  /** Server-supplied failure copy. Blank and `null` both render nothing. */
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}

/**
 * The frame every auth step shares: one card, one heading, one error slot.
 *
 * Having a single owner for the error banner is the point — each form used to
 * repeat the same `error != null && error.trim() !== ''` dance, which is exactly
 * the kind of thing that quietly diverges between screens.
 */
export function AuthCard({
  title,
  description,
  error,
  children,
  className,
}: AuthCardProps) {
  const hasError = error != null && error.trim() !== '';

  return (
    <Card className={`mx-auto w-full max-w-md pb-3 ${className ?? ''}`}>
      <CardContent className="p-6 py-2 pb-0">
        <h2 className="mb-4 text-center text-2xl font-bold">{title}</h2>

        {description != null && (
          <p className="text-muted-foreground mb-4 text-center text-sm">{description}</p>
        )}

        {hasError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {children}
      </CardContent>
    </Card>
  );
}
