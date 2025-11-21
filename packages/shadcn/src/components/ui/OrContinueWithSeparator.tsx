import React from 'react';
import { Separator } from '../ui/separator';

/**
 * A separator with a label for alternative sign-in methods.
 * Used in authentication forms to visually separate sections.
 */
export function OrContinueWithSeparator() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background text-muted-foreground px-2">Or continue with</span>
      </div>
    </div>
  );
}
