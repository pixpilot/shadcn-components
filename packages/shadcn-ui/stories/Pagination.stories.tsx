/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from '../src/pagination';

/**
 * A pagination component with configurable display variants and page navigation.
 * Supports full page numbers, simple prev/next, and compact modes.
 */
const meta = {
  title: 'shadcn-ui/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    totalPages: {
      control: 'number',
      description: 'Total number of pages',
    },
    maxVisiblePages: {
      control: 'number',
      description: 'Maximum number of page numbers to display',
    },
    variant: {
      control: 'select',
      options: ['full', 'simple', 'compact'],
      description: 'Display variant of the pagination',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the pagination component',
    },
    showFirstLastButtons: {
      control: 'boolean',
      description: 'Whether to show first/last page buttons',
    },
    showPageInfo: {
      control: 'boolean',
      description: 'Whether to show page info text (for simple variant)',
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default full pagination with page numbers
 */
export const Default: Story = {
  args: {
    totalPages: 10,
    maxVisiblePages: 5,
    variant: 'full',
    size: 'medium',
    showFirstLastButtons: true,
    onPageChange(event, page) {
      console.log('Page changed to:', page);
    },
    page: 1,
  },
  render: function DefaultPagination(args) {
    const [page, setPage] = useState(1);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    };

    return <Pagination {...args} page={page} onPageChange={handlePageChange} />;
  },
};

/**
 * Simple pagination with only prev/next buttons
 */
export const Simple: Story = {
  args: {
    totalPages: 10,
    variant: 'simple',
    showPageInfo: true,
    onPageChange(event, page) {
      console.log('Page changed to:', page);
    },
    page: 1,
  },
  render: function SimplePagination(args) {
    const [page, setPage] = useState(1);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    };

    return <Pagination {...args} page={page} onPageChange={handlePageChange} />;
  },
};

/**
 * Compact pagination with page indicator
 */
export const Compact: Story = {
  args: {
    totalPages: 20,
    variant: 'compact',
    onPageChange(event, page) {
      console.log('Page changed to:', page);
    },
    page: 1,
  },
  render: function CompactPagination(args) {
    const [page, setPage] = useState(5);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    };

    return <Pagination {...args} page={page} onPageChange={handlePageChange} />;
  },
};
