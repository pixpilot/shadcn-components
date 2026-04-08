import type React from 'react';
import { CircleAlertIcon, CircleCheckBigIcon, OctagonAlertIcon } from 'lucide-react';

export type AlertVariant = 'error' | 'info' | 'warning' | 'success' | 'default';

export interface VariantConfig {
  /**
   * Text color class for the primary/title text.
   */
  textClass: string;
  /**
   * Text color class for description/secondary text.
   */
  descClass: string;
  /**
   * Border color class (used in Alert-style components with a left border).
   */
  borderClass: string;
  /**
   * Icon component for this variant. Pass a `className` prop to control
   * size and any additional styles at the usage site.
   */
  IconComponent: React.ComponentType<{ className?: string }>;
}

export const variantConfig: Record<AlertVariant, VariantConfig> = {
  error: {
    textClass: 'text-destructive',
    descClass: 'text-destructive',
    borderClass: 'border-current/80!',
    IconComponent: OctagonAlertIcon,
  },
  warning: {
    textClass: 'text-amber-600 dark:border-amber-400 dark:text-amber-400',
    descClass: 'text-amber-600/80 dark:text-amber-400/80',
    borderClass: 'border-current/80!',
    IconComponent: CircleAlertIcon,
  },
  info: {
    textClass: 'text-sky-600 dark:border-sky-400 dark:text-sky-400',
    descClass: 'text-sky-600/80 dark:text-sky-400/80',
    borderClass: 'border-current/80!',
    IconComponent: CircleAlertIcon,
  },
  success: {
    textClass: 'text-green-600 dark:border-green-400 dark:text-green-400',
    descClass: 'text-green-600/80 dark:text-green-400/80',
    borderClass: 'border-current/80!',
    IconComponent: CircleCheckBigIcon,
  },
  default: {
    textClass: 'text-foreground',
    descClass: 'text-foreground/80',
    borderClass: 'border-current/60!',
    IconComponent: CircleAlertIcon,
  },
};
