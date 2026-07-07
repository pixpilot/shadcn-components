import type { ComponentProps, FC } from 'react';
import { connect } from '@formily/react';
import { Separator as ShadcnSeparator } from '@pixpilot/shadcn';

export type SeparatorProps = ComponentProps<typeof ShadcnSeparator>;

/**
 * Formily-connected Separator component
 * A visual divider for content sections
 */
export const Separator: FC<SeparatorProps> = connect(ShadcnSeparator);
