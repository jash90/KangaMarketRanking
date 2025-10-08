/**
 * useFilteredAndSortedMarkets Hook
 *
 * Orchestrates filtering and sorting of market data.
 * Combines useMarketFiltering and useMarketSorting for complete data transformation.
 */

import { SortConfig, SortField } from '@/api/types';
import { MarketData } from '@/types';
import { useMemo } from 'react';
import { MarketSearchField, useMarketFiltering } from './useMarketFiltering';
import { useMarketSorting, UseMarketSortingOptions } from './useMarketSorting';

export interface UseFilteredAndSortedMarketsOptions {
  sortingOptions?: UseMarketSortingOptions;
  searchFields?: MarketSearchField[];
}

export interface UseFilteredAndSortedMarketsReturn {
  filteredMarkets: MarketData[];
  sortConfigs: SortConfig[];
  toggleSort: (field: SortField) => void;
  clearSorts: () => void;
}

/**
 * Hook that combines filtering and sorting for market lists
 *
 * @param markets - Raw market data
 * @param searchQuery - Search query string
 * @param options - Configuration options
 * @returns Filtered and sorted markets with controls
 *
 * @example
 * const { filteredMarkets, sortConfigs, toggleSort } = useFilteredAndSortedMarkets(
 *   markets,
 *   debouncedSearch,
 *   { sortingOptions: { defaultSort: { field: 'volume', order: 'desc' } } }
 * );
 */
export function useFilteredAndSortedMarkets(
  markets: MarketData[],
  searchQuery: string,
  options: UseFilteredAndSortedMarketsOptions = {}
): UseFilteredAndSortedMarketsReturn {
  const { sortingOptions, searchFields } = options;

  // Initialize filtering
  const { filterMarkets } = useMarketFiltering({ searchFields });

  // Initialize sorting
  const { sortConfigs, toggleSort, sortMarkets, clearSorts } = useMarketSorting(sortingOptions);

  // Apply filtering and sorting
  const filteredMarkets = useMemo(() => {
    // Step 1: Filter by search query
    const filtered = filterMarkets(markets, searchQuery);

    // Step 2: Apply compound sorting
    const sorted = sortMarkets(filtered);

    return sorted;
  }, [markets, searchQuery, filterMarkets, sortMarkets]);

  return {
    filteredMarkets,
    sortConfigs,
    toggleSort,
    clearSorts,
  };
}
