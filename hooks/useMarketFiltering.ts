/**
 * useMarketFiltering Hook
 *
 * Handles search filtering logic for market lists.
 * Supports multi-field search with customizable search fields.
 */

import { useMemo } from 'react';
import { MarketData } from '@/types';

export type MarketSearchField = 'market' | 'tickerId' | 'baseSymbol' | 'targetSymbol';

export interface UseMarketFilteringOptions {
  searchFields?: MarketSearchField[];
}

export interface UseMarketFilteringReturn {
  filterMarkets: (markets: MarketData[], query: string) => MarketData[];
}

/**
 * Hook for filtering markets by search query
 *
 * @param options - Configuration options
 * @returns Filtering function
 *
 * @example
 * const { filterMarkets } = useMarketFiltering({
 *   searchFields: ['market', 'tickerId', 'baseSymbol']
 * });
 * const filtered = filterMarkets(markets, searchQuery);
 */
export function useMarketFiltering(
  options: UseMarketFilteringOptions = {}
): UseMarketFilteringReturn {
  const { searchFields = ['market', 'tickerId', 'baseSymbol', 'targetSymbol'] } = options;

  /**
   * Filter markets by search query
   * Memoized to prevent recreation on every render
   */
  const filterMarkets = useMemo(
    () =>
      (markets: MarketData[], query: string): MarketData[] => {
        if (!query.trim()) {
          return markets;
        }

        const searchTerm = query.toLowerCase().trim();

        return markets.filter((market) => {
          return searchFields.some((field) => {
            const value = market[field];
            return value && value.toLowerCase().includes(searchTerm);
          });
        });
      },
    [searchFields]
  );

  return {
    filterMarkets,
  };
}
