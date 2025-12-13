import {
  Pagination as OrgPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@pixpilot/shadcn';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react';

export interface PaginationProps {
  /**
   * Current page number (1-indexed)
   */
  page: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Callback when page changes
   */
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;

  /**
   * Maximum number of page numbers to display (excluding ellipsis)
   * For example, with maxVisiblePages=4 and 10 total pages:
   * - Page 1: <1 2 3 ... 10>
   * - Page 5: <1 ... 5 ... 10>
   * - Page 10: <1 ... 8 9 10>
   * Set to 0 to hide page numbers entirely (only show prev/next buttons)
   *
   * @default 4
   */
  maxVisiblePages?: number;

  /**
   * Display variant:
   * - 'full': Shows page numbers with prev/next (e.g., < 1 2 3 ... 10 >)
   * - 'simple': Only shows prev/next buttons (e.g., < >)
   * - 'compact': Shows page indicator with all nav buttons (e.g., << < 2/10 > >>)
   *
   * @default 'full'
   */
  variant?: 'full' | 'simple' | 'compact';

  /**
   * Size of the pagination component
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether to show first/last page buttons
   * @default true
   */
  showFirstLastButtons?: boolean;

  /**
   * Whether to show page info text (e.g., "Page 1 of 10")
   * Only used with 'simple' variant
   * @default false
   */
  showPageInfo?: boolean;

  className?: string;
}

/**
 * Reusable pagination component with configurable page number display.
 *
 * @example
 * // Full variant - default with page numbers
 * <Pagination
 *   page={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 *   variant="full"
 * />
 *
 * @example
 * // Compact variant - page indicator with first/prev/next/last buttons
 * <Pagination
 *   page={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 *   variant="compact"
 * />
 *
 * @example
 * // Simple variant - only prev/next buttons
 * <Pagination
 *   page={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 *   variant="simple"
 *   showPageInfo={true}
 * />
 */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  maxVisiblePages = 6,
  variant = 'full',
  showPageInfo = false,
  className,
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (newPage: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(e as unknown as React.ChangeEvent<unknown>, newPage);
  };

  /**
   * Generate page numbers to show.
   * Always shows exactly maxVisiblePages numbers (or less if totalPages is smaller).
   * Examples with maxVisiblePages=4:
   * - Total 10, Page 1: [1, 2, 3, ellipsis, 10]
   * - Total 10, Page 5: [1, ellipsis, 5, ellipsis, 10]
   * - Total 10, Page 10: [1, ellipsis, 8, 9, 10]
   */
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

    // If total pages is less than or equal to max visible, show all
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // We need to fit exactly maxVisiblePages numbers
    // Strategy: Always show first and last, then fill the remaining slots

    const firstPage = 1;
    const lastPage = totalPages;
    const reservedSlots = 2; // First and last page

    // Check if we can show pages without ellipsis at the start
    const canFitAtStart = page <= maxVisiblePages - 1;
    // Check if we can show pages without ellipsis at the end
    const canFitAtEnd = page >= totalPages - (maxVisiblePages - reservedSlots);

    if (canFitAtStart) {
      // Show first maxVisiblePages-1 pages, then ellipsis, then last page
      // Example: [1, 2, 3, ..., 10] for maxVisiblePages=4
      for (let i = 1; i < maxVisiblePages; i++) {
        pages.push(i);
      }
      pages.push('ellipsis-end');
      pages.push(lastPage);
    } else if (canFitAtEnd) {
      // Show first page, ellipsis, then last maxVisiblePages-1 pages
      // Example: [1, ..., 8, 9, 10] for maxVisiblePages=4
      pages.push(firstPage);
      pages.push('ellipsis-start');
      for (let i = totalPages - (maxVisiblePages - reservedSlots); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, ellipsis, middle pages around current, ellipsis, last
      // Example: [1, ..., 5, ..., 10] for maxVisiblePages=4
      // We have maxVisiblePages slots total
      // Use: 1 for first, 1 for last, remaining for middle
      const middleSlots = maxVisiblePages - reservedSlots;
      const halfSlots = 2;

      pages.push(firstPage);
      pages.push('ellipsis-start');

      // Center the middle pages around current page
      const halfMiddle = Math.floor(middleSlots / halfSlots);
      let start = page - halfMiddle;
      let end = start + middleSlots - 1;

      // Ensure we don't overlap with first/last
      start = Math.max(firstPage + 1, start);
      end = Math.min(lastPage - 1, end);

      // Adjust to maintain correct count
      if (end - start + 1 < middleSlots) {
        if (start === firstPage + 1) {
          end = start + middleSlots - 1;
        } else {
          start = end - middleSlots + 1;
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      pages.push('ellipsis-end');
      pages.push(lastPage);
    }

    return pages;
  };

  const pages = getPageNumbers();

  // Compact variant: << < 2/10 > >>
  if (variant === 'compact') {
    return (
      <OrgPagination className={className}>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              onClick={handlePageClick(1)}
              aria-label="Go to first page"
              className="gap-1 px-2"
            >
              <ChevronsLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious onClick={handlePageClick(Math.max(1, page - 1))} />
          </PaginationItem>
          <PaginationItem>
            <span className="flex h-9 items-center justify-center px-4 text-sm font-medium">
              {page}/{totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={handlePageClick(Math.min(totalPages, page + 1))} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={handlePageClick(totalPages)}
              aria-label="Go to last page"
              className="gap-1 px-2"
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </OrgPagination>
    );
  }

  // Simple variant: only prev/next buttons
  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-center gap-4 ${className ?? ''}`}>
        {showPageInfo && (
          <span className="text-sm whitespace-nowrap">
            Page {page} of {totalPages}
          </span>
        )}
        <OrgPagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePageClick(Math.max(1, page - 1))} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={handlePageClick(Math.min(totalPages, page + 1))} />
            </PaginationItem>
          </PaginationContent>
        </OrgPagination>
      </div>
    );
  }

  // Full variant: with page numbers
  return (
    <div className={`flex items-center justify-center gap-4 ${className ?? ''}`}>
      {showPageInfo && (
        <span className="text-sm whitespace-nowrap">
          Page {page} of {totalPages}
        </span>
      )}
      <OrgPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePageClick(Math.max(1, page - 1))} />
          </PaginationItem>
          {pages.map((p) =>
            typeof p === 'string' ? (
              <PaginationItem key={p}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink onClick={handlePageClick(p)} isActive={p === page}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext onClick={handlePageClick(Math.min(totalPages, page + 1))} />
          </PaginationItem>
        </PaginationContent>
      </OrgPagination>
    </div>
  );
};
