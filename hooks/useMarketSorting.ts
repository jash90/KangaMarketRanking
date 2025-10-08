/**
 * useMarketSorting Hook
 *
 * Manages compound sorting state and logic for market lists.
 * Supports up to 2 simultaneous sorts with priority ordering.
 */

import { SortConfig, SortField } from '@/api/types';
import { compareByField } from '@/utils/marketComparators';
import { useCallback, useState } from 'react';
import { MarketData } from '@/types';

export interface UseMarketSortingOptions {
  defaultSort?: SortConfig;
  maxSorts?: number;
}

export interface UseMarketSortingReturn {
  sortConfigs: SortConfig[];
  toggleSort: (field: SortField) => void;
  sortMarkets: (markets: MarketData[]) => MarketData[];
  clearSorts: () => void;
}

/**
 * Hook for managing market sorting with compound sort support
 *
 * @param options - Configuration options
 * @returns Sorting state and functions
 *
 * @example
 * const { sortConfigs, toggleSort, sortMarkets } = useMarketSorting({
 *   defaultSort: { field: 'volume', order: 'desc' }
 * });
 */
export function useMarketSorting(options: UseMarketSortingOptions = {}): UseMarketSortingReturn {
  const { defaultSort = { field: 'volume', order: 'desc' }, maxSorts = 2 } = options;

  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([defaultSort]);

  /**
   * Toggle sort field with multi-select support
   * Cycle: OFF → DESC → ASC → OFF
   */
  const toggleSort = useCallback(
    (field: SortField) => {
      setSortConfigs((current) => {
        const existingIndex = current.findIndex((config) => config.field === field);

        if (existingIndex !== -1) {
          // Field already in sort chain - cycle its order
          const existing = current[existingIndex]!;

          if (existing.order === 'desc') {
            // DESC → ASC
            const updated = [...current];
            updated[existingIndex] = { field, order: 'asc' };
            return updated;
          } else {
            // ASC → OFF (remove from chain)
            const filtered = current.filter((_, i) => i !== existingIndex);
            // If removed all, return to default
            return filtered.length === 0 ? [defaultSort] : filtered;
          }
        } else {
          // New field - add to sort chain
          if (current.length >= maxSorts) {
            // Max sorts reached: replace the oldest (first) with new one
            return [...current.slice(1), { field, order: 'desc' }];
          } else {
            // Add as additional sort
            return [...current, { field, order: 'desc' }];
          }
        }
      });
    },
    [defaultSort, maxSorts]
  );

  /**
   * Apply compound sorting to market array
   */
  const sortMarkets = useCallback(
    (markets: MarketData[]): MarketData[] => {
      return [...markets].sort((a, b) => {
        // Apply each sort config in priority order
        for (const config of sortConfigs) {
          const comparison = compareByField(a, b, config.field);

          if (comparison !== 0) {
            // Non-zero comparison - apply sort order and return
            return config.order === 'asc' ? comparison : -comparison;
          }
          // If comparison is 0, continue to next sort level
        }

        // All comparisons equal - maintain original order
        return 0;
      });
    },
    [sortConfigs]
  );

  /**
   * Reset to default sort
   */
  const clearSorts = useCallback(() => {
    setSortConfigs([defaultSort]);
  }, [defaultSort]);

  return {
    sortConfigs,
    toggleSort,
    sortMarkets,
    clearSorts,
  };
}
