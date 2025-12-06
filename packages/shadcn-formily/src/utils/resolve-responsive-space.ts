import type { FormSpace, Space } from '../types';

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
 * Space to Tailwind space-y class mapping
 * Converts space values to actual Tailwind utilities
 */
const spaceClassMap: Record<Space, string> = {
  sm: 'space-y-3',
  md: 'space-y-4',
  lg: 'space-y-6',
} as const;

/**
 * Space to Tailwind gap class mapping
 * Converts space values to gap utilities for grid/flex containers
 */
const gapClassMap: Record<Space, string> = {
  sm: 'gap-y-3',
  md: 'gap-y-4',
  lg: 'gap-y-6',
} as const;

/**
 * Responsive breakpoint classes for responsive density mode
 * - Mobile (default): compact (space-y-3)
 * - Tablet (md:): normal (space-y-4)
 * - Desktop (lg:): comfortable (space-y-6)
 */
export const autoResponsiveSpaceClasses = 'space-y-3 md:space-y-4 lg:space-y-6';

/**
 * Responsive breakpoint classes for responsive density mode using gap
 * - Mobile (default): compact (gap-y-3)
 * - Tablet (md:): normal (gap-y-4)
 * - Desktop (lg:): comfortable (gap-y-6)
 */
export const autoResponsiveGapClasses = 'gap-y-3 md:gap-y-4 lg:gap-y-6';

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
 * 1. If responsive is set → use it (ignore density)
 * 2. If density is 'responsive' → return undefined (handled separately with responsive classes)
 * 3. If only other density is set → use density-based mapping
 * 4. Default to undefined (responsive mode)
 *
 * @param formSpace - FormSpace configuration
 * @returns Space value ('sm' | 'md' | 'lg') or undefined for responsive mode
 */
export function resolveResponsiveSpace(formSpace?: FormSpace): Space | undefined {
  if (!formSpace) {
    return undefined;
  }

  // If responsive is set, use it (takes priority over density)
  if (formSpace.responsive) {
    // For now, we'll use desktop as the default
    // In a real implementation, you might want to detect actual screen size
    return (
      formSpace.responsive.desktop ||
      formSpace.responsive.tablet ||
      formSpace.responsive.mobile ||
      'lg'
    );
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
 * Gets the Tailwind class for a given space value
 *
 * @param space - Space value
 * @returns Tailwind utility class
 */
export function getSpaceClass(space: Space): string {
  return spaceClassMap[space];
}

/**
 * Resolves responsive space and returns the Tailwind class(es)
 * For responsive density, returns responsive breakpoint classes
 * For fixed density, returns single space class
 *
 * @param formSpace - FormSpace configuration
 * @returns Tailwind utility class(es)
 */
export function resolveResponsiveSpaceClass(formSpace?: FormSpace): string {
  // Use responsive classes if density is responsive or not specified
  if (!formSpace || isResponsiveDensity(formSpace.density)) {
    return autoResponsiveSpaceClasses;
  }

  // If responsive is set without responsive density, use it
  if (formSpace.responsive && !isResponsiveDensity(formSpace.density)) {
    const space = resolveResponsiveSpace(formSpace);
    return space ? getSpaceClass(space) : autoResponsiveSpaceClasses;
  }

  // For fixed density modes
  const space = resolveResponsiveSpace(formSpace);
  return space ? getSpaceClass(space) : autoResponsiveSpaceClasses;
}

/**
 * Gets the Tailwind gap class for a given space value
 *
 * @param space - Space value
 * @returns Tailwind utility gap class
 */
export function getGapClass(space: Space): string {
  return gapClassMap[space];
}

/**
 * Resolves responsive space and returns the Tailwind gap class(es)
 * For responsive density, returns responsive breakpoint classes
 * For fixed density, returns single gap class
 *
 * @param formSpace - FormSpace configuration
 * @returns Tailwind utility gap class(es)
 */
export function resolveResponsiveGapClass(formSpace?: FormSpace): string {
  // Use responsive classes if density is responsive or not specified
  if (!formSpace || isResponsiveDensity(formSpace.density)) {
    return autoResponsiveGapClasses;
  }

  // If responsive is set without responsive density, use it
  if (formSpace.responsive && !isResponsiveDensity(formSpace.density)) {
    const space = resolveResponsiveSpace(formSpace);
    return space ? getGapClass(space) : autoResponsiveGapClasses;
  }

  // For fixed density modes
  const space = resolveResponsiveSpace(formSpace);
  return space ? getGapClass(space) : autoResponsiveGapClasses;
}
