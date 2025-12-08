import type { FC } from 'react';

import type { IconProvider } from './types';
import type { AsyncIconProvider } from './use-async-providers';
import { Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@pixpilot/shadcn';
import { X } from 'lucide-react';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader } from '../Loader';
import { useAsyncProviders } from './use-async-providers';
import VirtualizedIconGrid from './virtualized-icon-grid';

function noIconMessage(hasIcons: boolean, isSearching: boolean) {
  if (hasIcons) return '';
  if (!isSearching) {
    return 'No icons provided by the selected provider!';
  }
  return 'No icons found matching your search';
}

/**
 * Icon Selector Content Component
 * Displays searchable icon grid with provider tabs
 */
interface IconPickerContentProps {
  providers: AsyncIconProvider[];
  onChange?: (value: string) => void;
  onSelect?: () => void;
  /**
   * Max height for the icon grid (CSS value, e.g. '60vh', '400px')
   */
  maxHeight?: string;
}

const IconPickerContent: FC<IconPickerContentProps> = ({
  providers: providersProp,
  onChange,
  onSelect,
  maxHeight = '60vh',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { providers, isLoading } = useAsyncProviders(providersProp);

  const providerPrefixes = useMemo(
    () => providers.map((provider) => provider.prefix),
    [providers],
  );

  const [activeProvider, setActiveProvider] = useState(providerPrefixes[0] ?? 'default');

  /**
   * Sync activeProvider when providers load with delay
   */
  useEffect(() => {
    if (providerPrefixes.length > 0) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setActiveProvider((current) => {
        // Only update if still at default value
        if (current === 'default') {
          return providerPrefixes[0] ?? 'default';
        }
        return current;
      });
    }
  }, [providerPrefixes]);

  /**
   * Get all icons for a provider
   */
  const getProviderIcons = useCallback((provider: IconProvider): string[] => {
    try {
      return provider.icons.map((iconName) => `${provider.prefix}:${iconName}`);
    } catch {
      return [];
    }
  }, []);

  /**
   * Create a map of all icons grouped by provider
   */
  const allIconsByProvider = useMemo(() => {
    const map: Record<string, string[]> = {};

    for (const provider of providers) {
      map[provider.prefix] = getProviderIcons(provider);
    }
    return map;
  }, [providers, getProviderIcons]);

  /**
   * Filter icons: when searching, show from all providers; otherwise show active
   */
  const filteredIconsData = useMemo(() => {
    if (!searchQuery) {
      const activeIcons = allIconsByProvider[activeProvider];
      return {
        isSearching: false,
        data: activeIcons ?? [],
      };
    }

    // When searching, collect results from all providers into a single flat array
    const results: string[] = [];
    const searchLower = searchQuery.toLowerCase();

    for (const provider of providers) {
      const icons = allIconsByProvider[provider.prefix];
      const iconList = icons ?? [];
      const filtered = iconList.filter((icon) =>
        icon.toLowerCase().includes(searchLower),
      );

      results.push(...filtered);
    }

    return {
      isSearching: true,
      data: results,
    };
  }, [searchQuery, activeProvider, allIconsByProvider, providers]);

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      onChange?.(iconName);
      onSelect?.();
    },
    [onChange, onSelect],
  );

  const { isSearching, data: filteredData } = filteredIconsData;

  const hasNoResults =
    (!isSearching && filteredData.length === 0) ||
    (isSearching && filteredData.length === 0);

  return (
    <div className="flex flex-col gap-4 min-h-[200px] max-h-[80vh]">
      <div className="relative">
        <Input
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          disabled={isLoading}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabs for provider selection (hidden when searching) */}
      {!isSearching && providers.length > 1 && (
        <Tabs value={activeProvider} onValueChange={setActiveProvider}>
          <TabsList className="w-full">
            {providers.map((provider) => (
              <TabsTrigger key={provider.prefix} value={provider.prefix}>
                {provider.name ?? provider.prefix}
              </TabsTrigger>
            ))}
          </TabsList>

          {providers.map((provider) => (
            <TabsContent key={provider.prefix} value={provider.prefix}>
              <VirtualizedIconGrid
                icons={allIconsByProvider[provider.prefix] ?? []}
                onSelectIcon={handleSelectIcon}
                maxHeight={maxHeight}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* No results message */}
      {hasNoResults && isSearching && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            {noIconMessage(false, isSearching)}
          </p>
        </div>
      )}

      {/* {isLoading && ( */}
      {/* <div className="h-full min-h-[100px]"> */}
      <Loader message="Loading icons..." loading={isLoading} />
      {/* </div> */}
      {/* )} */}

      {/* When searching, show all results as a flat list */}
      {isSearching && providers.length > 0 && (
        <VirtualizedIconGrid
          icons={filteredData}
          onSelectIcon={handleSelectIcon}
          maxHeight={maxHeight}
        />
      )}

      {/* Single provider mode */}
      {!isSearching && providers.length === 1 && (
        <VirtualizedIconGrid
          icons={filteredData}
          onSelectIcon={handleSelectIcon}
          maxHeight={maxHeight}
        />
      )}
    </div>
  );
};

export default IconPickerContent;
