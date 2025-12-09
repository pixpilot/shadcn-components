import type { IconProvider, IconProviderProps } from '../icon-selector';
import { useEffect, useRef, useState } from 'react';
import { isValidProvider } from './utils/is-valid-provider';

interface UseAsyncProvidersReturn {
  providers: IconProviderProps[];
  isLoading: boolean;
  errors: Error[];
}

export function useAsyncProviders(
  providers: IconProvider[] = [],
): UseAsyncProvidersReturn {
  const [state, setState] = useState<{
    resolved: IconProviderProps[];
    loading: boolean;
    errors: Error[];
  }>({
    resolved: [],
    loading: false,
    errors: [],
  });

  // Store the previous providers array to compare items, not just the array reference
  // This allows the user to pass `[ProviderA]` inline without causing infinite loops.
  const previousProvidersRef = useRef<IconProvider[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (state.loading) return;

    // 1. Stability Check:
    // If the array is new, but the items inside are the EXACT same references,
    // we do not need to re-run the effect.
    const isSameLength = previousProvidersRef.current.length === providers.length;
    const isSameItems =
      isSameLength && providers.every((p, i) => p === previousProvidersRef.current[i]);

    if (isSameItems) {
      return;
    }

    // Update ref for next render
    previousProvidersRef.current = providers;

    const loadProviders = async () => {
      if (!providers.length) {
        if (isMounted) setState({ resolved: [], loading: false, errors: [] });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, errors: [] }));

      const loaded: IconProviderProps[] = [];
      const loadErrors: Error[] = [];

      const results = await Promise.allSettled(
        providers.map(async (p) => {
          if (typeof p === 'function') return p();
          return p;
        }),
      );

      for (const [index, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          const provider = result.value;
          if (isValidProvider(provider)) {
            loaded.push(provider);
          } else {
            const err = new Error(
              `Invalid provider at index ${index}: Missing required fields.`,
            );
            loadErrors.push(err);
            console.warn(err.message, provider);
          }
        } else {
          const err =
            result.reason instanceof Error
              ? result.reason
              : new Error(String(result.reason));
          loadErrors.push(err);
          console.error(`Provider at index ${index} failed to load:`, err);
        }
      }

      setState({
        resolved: loaded,
        loading: false,
        errors: loadErrors,
      });
    };

    // eslint-disable-next-line ts/no-floating-promises
    loadProviders();

    // eslint-disable-next-line consistent-return
    return () => {
      isMounted = false;
    };
  }, [providers, state.loading]);

  return {
    providers: state.resolved,
    isLoading: state.loading,
    errors: state.errors,
  };
}
