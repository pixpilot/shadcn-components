import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Toggle } from '../../../src/components/ui/toggle';

describe('toggle', () => {
  it('should use muted background for active state to avoid visual conflicts', () => {
    /*
     * Why this exists:
     * - The original shadcn/ui implementation uses accent colors for the active state (data-[state=on]).
     * - In our design system, accent colors are reserved for primary actions and highlights.
     * - Using muted background for the toggle's active state provides better visual hierarchy and reduces emphasis.
     * - Text color remains default to maintain readability.
     * - This test ensures that when the component is updated from upstream shadcn/ui,
     *   the muted background styling is preserved, preventing unintended visual changes.
     */
    const { container } = render(<Toggle>Toggle</Toggle>);
    const toggleElement = container.querySelector('[data-slot="toggle"]');
    expect(toggleElement).toBeInTheDocument();
    const className = toggleElement?.className;
    expect(className).toContain('data-[state=on]:bg-muted');
    // Ensure no accent text colors are used
    expect(className).not.toContain('text-accent-foreground');
    expect(className).not.toContain('hover:text-accent-foreground');
  });

  it('should not use accent text colors in outline variant', () => {
    /*
     * Why this exists:
     * - The original shadcn/ui outline variant uses hover:text-accent-foreground.
     * - In our design system, accent colors are reserved for primary actions.
     * - Text should remain default color for readability.
     * - This test prevents regression when updating from upstream shadcn/ui.
     */
    const { container } = render(<Toggle variant="outline">Toggle</Toggle>);
    const toggleElement = container.querySelector('[data-slot="toggle"]');
    expect(toggleElement).toBeInTheDocument();
    const className = toggleElement?.className;
    expect(className).not.toContain('text-accent-foreground');
    expect(className).not.toContain('hover:text-accent-foreground');
  });
});
