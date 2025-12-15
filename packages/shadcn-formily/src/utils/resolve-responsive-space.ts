import type { FormSpace, Space } from '../types';

/**
 * Unified spacing configuration type
 * Combines fixed density classes and responsive breakpoint classes
 */
export interface SpacingConfig {
  fixed: Record<Space, string>;
  responsive: string;
}

/**
 * Density-based space mapping
 * Maps density levels to Tailwind space utilities
 */
const densitySpaceMap: Record<
  Exclude<NonNullable<FormSpace['density']>, 'responsive'>,
  Space
> = {
  compact: 'sm',
  normal: 'md',
  comfortable: 'lg',
};

/**
 * Space-Y spacing configuration
 * Controls vertical spacing between form items
 */
export const spaceYConfig: SpacingConfig = {
  fixed: {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  },
  responsive: 'space-y-3 md:space-y-4 lg:space-y-6',
} as const;

/**
 * Gap-Y spacing configuration
 * Controls vertical gaps in containers
 */
export const gapYConfig: SpacingConfig = {
  fixed: {
    sm: 'gap-y-3',
    md: 'gap-y-4',
    lg: 'gap-y-6',
  },
  responsive: 'gap-y-3 md:gap-y-4 lg:gap-y-6',
} as const;

/**
 * Resolves spacing class based on density and spacing configuration
 * Generic utility that works with any spacing config
 *
 * @param density - Density value ('compact' | 'normal' | 'comfortable' | 'responsive')
 * @param config - Spacing configuration with fixed and responsive classes
 * @returns Tailwind utility class(es)
 */
export function resolveSpacingClass(
  density: FormSpace['density'],
  config: SpacingConfig,
): string {
  // Use responsive classes if density is responsive or not specified
  if (!density || density === 'responsive') {
    return config.responsive;
  }

  const space = densitySpaceMap[density];
  return config.fixed[space];
}

/**
 * Resolves responsive space and returns the Tailwind space-y class(es)
 * For responsive density, returns responsive breakpoint classes
 * For fixed density, returns single space class
 *
 * @param formSpace - FormSpace configuration
 * @returns Tailwind utility class(es)
 */
export function resolveResponsiveSpaceClass(formSpace?: FormSpace): string {
  return resolveSpacingClass(formSpace?.density, spaceYConfig);
}

/**
 * Resolves responsive space and returns the Tailwind gap-y class(es)
 * For responsive density, returns responsive breakpoint classes
 * For fixed density, returns single gap class
 *
 * @param formSpace - FormSpace configuration
 * @returns Tailwind utility gap class(es)
 */
export function resolveResponsiveGapClass(formSpace?: FormSpace): string {
  return resolveSpacingClass(formSpace?.density, gapYConfig);
}

/**
 * Checks if density is responsive mode
 *
 * @param density - Density value
 * @returns true if density is 'responsive'
 */
export function isResponsiveDensity(density?: string): density is 'responsive' {
  return density === 'responsive';
}

/**
 * Resolves responsive space value from FormSpace configuration
 * Priority:
 * 1. If density is 'responsive' → return undefined (handled separately with responsive classes)
 * 2. If only other density is set → use density-based mapping
 * 3. Default to undefined (responsive mode)
 *
 * @param formSpace - FormSpace configuration
 * @returns Space value ('sm' | 'md' | 'lg') or undefined for responsive mode
 */
export function resolveResponsiveSpace(formSpace?: FormSpace): Space | undefined {
  if (!formSpace) {
    return undefined;
  }

  // If density is responsive, return undefined (handled with responsive classes)
  if (isResponsiveDensity(formSpace.density)) {
    return undefined;
  }

  // If only density is set, use density-based mapping
  if (formSpace.density && !isResponsiveDensity(formSpace.density)) {
    return densitySpaceMap[formSpace.density];
  }

  // Default to undefined (responsive mode)
  return undefined;
}

/**
 * Deprecated: Use resolveSpacingClass instead
 * @deprecated
 */
export const autoResponsiveSpaceClasses = spaceYConfig.responsive;

/**
 * Deprecated: Use resolveSpacingClass instead
 * @deprecated
 */
export const autoResponsiveGapClasses = gapYConfig.responsive;
