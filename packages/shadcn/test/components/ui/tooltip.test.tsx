import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../src/components/ui/tooltip';

describe('tooltipContent', () => {
  it('should not use text-balance by default', () => {
    /*
     * Why this exists:
     * - text-balance can force tooltip copy to wrap earlier than normal.
     * - That is useful for headings, but it is a poor shared default for
     *   explanatory tooltip content with paragraphs or lists.
     * - Keep this removed when updating the component from upstream shadcn/ui.
     */
    render(
      <Tooltip open>
        <TooltipTrigger>Credits</TooltipTrigger>
        <TooltipContent>
          Available credits are the total credits currently spendable.
        </TooltipContent>
      </Tooltip>,
    );

    const tooltipContent = document.querySelector('[data-slot="tooltip-content"]');
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent?.className).not.toContain('text-balance');
  });
});
