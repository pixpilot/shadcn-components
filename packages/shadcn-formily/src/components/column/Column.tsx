import { cn } from '@pixpilot/shadcn';
import React from 'react';

export interface IColumnProps {
  /**
   * Custom className (use Tailwind flex utilities: flex-1, w-1/2, w-1/3, basis-1/4, etc.)
   */
  className?: string;
  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * Column component for creating multi-column layouts in forms
 * Should be used as children of Row components
 * Use Tailwind flex utilities for sizing: flex-1, w-1/2, w-1/3, w-1/4, basis-*, grow, shrink, etc.
 *
 * @example
 * ```tsx
 * <Row className="gap-4">
 *   <Column className="flex-1">
 *     <FormItem label="First Name">
 *       <Input />
 *     </FormItem>
 *   </Column>
 *   <Column className="flex-1">
 *     <FormItem label="Last Name">
 *       <Input />
 *     </FormItem>
 *   </Column>
 * </Row>
 * ```
 */
export function Column({ className, children }: IColumnProps) {
  return <div className={cn('w-full space-y-4', className)}>{children}</div>;
}
