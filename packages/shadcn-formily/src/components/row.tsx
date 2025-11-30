import { cn } from '@internal/shadcn';
import React from 'react';

export interface IRowProps {
  /**
   * Custom className (use Tailwind gap-* for spacing, flex-wrap, items-*, justify-*, etc.)
   */
  className?: string;
  /**
   * Children (should be Column components)
   */
  children?: React.ReactNode;
}

/**
 * Row component for creating multi-column layouts in forms
 * Should be used with Column components as children
 * Use Tailwind classes for all styling: gap-4, flex-wrap, items-center, justify-between, etc.
 *
 * @example
 * ```tsx
 * <Row className="gap-4 flex-wrap">
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
export function Row({ className, children }: IRowProps) {
  return <div className={cn('flex', className)}>{children}</div>;
}
