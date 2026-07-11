import type { ComponentMeta } from '@internal/mcp';
import type { PaginationProps } from './Pagination';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `PaginationProps` is a compile error until it is documented
// here.
type PaginationDocumentedProps = Extract<keyof PaginationProps, string>;

export const meta: ComponentMeta<PaginationDocumentedProps> = {
  name: 'Pagination',
  category: 'Navigation',
  description:
    'A page navigation control with full, simple, and compact variants, ellipsis handling, and optional page-info text.',
  props: defineProps<PaginationDocumentedProps>({
    id: 'Optional id attribute applied to the pagination navigation element.',
    className: 'Additional CSS class applied to the pagination navigation element.',
    page: {
      description: 'Current page number (1-indexed).',
      type: 'number',
    },
    totalPages: {
      description:
        'Total number of pages. The component renders nothing when this is <= 1.',
      type: 'number',
    },
    onPageChange: {
      description:
        'Called with the event and the next page number when a page is selected.',
      type: '(event: React.ChangeEvent<unknown>, page: number) => void',
    },
    maxVisiblePages: {
      description:
        'Maximum page numbers to display before using ellipsis. Set to 0 to show only prev/next.',
      type: 'number',
      defaultValue: '4',
    },
    variant: {
      description:
        'Layout style: "full" (numbers), "simple" (prev/next only), or "compact" (page indicator with all nav buttons).',
      type: '"full" | "simple" | "compact"',
      defaultValue: '"full"',
    },
    size: {
      description: 'Size of the pagination control.',
      type: '"small" | "medium" | "large"',
      defaultValue: '"medium"',
    },
    showFirstLastButtons: {
      description: 'Whether to show first/last page buttons.',
      type: 'boolean',
      defaultValue: 'true',
    },
    showPageInfo: {
      description: 'Whether to show "Page X of Y" text (used with the "simple" variant).',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  examples: [
    {
      title: 'Full pagination',
      code: '<Pagination page={page} totalPages={10} onPageChange={(_, next) => setPage(next)} />',
    },
    {
      title: 'Compact pagination',
      code: '<Pagination page={page} totalPages={10} onPageChange={(_, next) => setPage(next)} variant="compact" />',
    },
  ],
  keywords: ['pagination', 'pager', 'pages', 'navigation'],
};
