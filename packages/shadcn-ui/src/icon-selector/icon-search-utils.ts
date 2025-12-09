import type { IconProviderProps } from './types';

/**
 * Icon data with pre-computed search strings for performance
 */
export interface IconSearchData {
  /**
   * Full icon name with prefix (e.g., "mdi:heart")
   */
  fullName: string;
  /**
   * Lowercase version for case-insensitive searching
   */
  searchName: string;
}

/**
 * Pre-compute lowercase icon names for efficient searching
 * This avoids running toLowerCase() on every icon for every keystroke
 *
 * @param providers - Array of icon providers
 * @returns Map of provider prefix to icon search data
 */
export function createIconSearchIndex(
  providers: IconProviderProps[],
): Map<string, IconSearchData[]> {
  const searchIndex = new Map<string, IconSearchData[]>();

  for (const provider of providers) {
    const iconData: IconSearchData[] = [];

    for (const iconName of provider.icons) {
      const fullName = `${provider.prefix}:${iconName}`;
      iconData.push({
        fullName,
        searchName: fullName.toLowerCase(),
      });
    }

    searchIndex.set(provider.prefix, iconData);
  }

  return searchIndex;
}

/**
 * Search icons efficiently using pre-computed search index
 *
 * @param searchIndex - Pre-computed search index
 * @param query - Search query (will be lowercased)
 * @param providerPrefix - Optional: search only in specific provider
 * @returns Array of matching icon names
 */
export function searchIcons(
  searchIndex: Map<string, IconSearchData[]>,
  query: string,
  providerPrefix?: string,
): string[] {
  if (!query) {
    return [];
  }

  const searchLower = query.toLowerCase();
  const results: string[] = [];

  if (providerPrefix !== undefined && providerPrefix.length > 0) {
    // Search in specific provider only
    const iconData = searchIndex.get(providerPrefix);
    if (iconData) {
      for (const icon of iconData) {
        if (icon.searchName.includes(searchLower)) {
          results.push(icon.fullName);
        }
      }
    }
  } else {
    // Search across all providers
    for (const iconData of searchIndex.values()) {
      for (const icon of iconData) {
        if (icon.searchName.includes(searchLower)) {
          results.push(icon.fullName);
        }
      }
    }
  }

  return results;
}
