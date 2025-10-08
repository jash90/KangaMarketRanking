/**
 * useMarketData Hook
 *
 * Fetches and processes market data from Kanga Exchange API.
 * Combines market pairs and summaries, calculates spreads, and classifies liquidity.
 */

import { kangaApi } from '@/api/client';
import { logger } from '@/utils';
import { useCallback, useEffect, useState } from 'react';
import { MarketData } from '@/types';
import { classifyRAG } from '../utils/ragClassifier';
import { calculateSpread } from '../utils/spreadCalculator';

export interface UseMarketDataReturn {
  markets: MarketData[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Fetch and process market data
 *
 * @returns Market data state and refresh function
 *
 * @example
 * const { markets, loading, error, refresh } = useMarketData();
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} onRetry={refresh} />;
 *
 * return <MarketList markets={markets} />;
 */
export function useMarketData(): UseMarketDataReturn {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Fetch and process market data
   */
  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      logger.info('[useMarketData] Fetching market data...');

      // Fetch pairs and summaries in parallel for better performance
      const [pairs, summaries] = await Promise.all([
        kangaApi.getMarketPairs(),
        kangaApi.getMarketSummary(),
      ]);

      logger.info('[useMarketData] Fetched data', {
        pairs: pairs.length,
        summaries: summaries.length,
      });

      // Create a map for quick summary lookup by ticker_id
      const summaryMap = new Map(summaries.map((s) => [s.ticker_id, s]));

      // Combine and process data
      const processedMarkets: MarketData[] = pairs.map((pair) => {
        const summary = summaryMap.get(pair.ticker_id);

        // Extract bid and ask
        const bid = summary?.bid ?? null;
        const ask = summary?.ask ?? null;

        // Calculate spread
        const spread = calculateSpread(bid, ask);

        // Classify liquidity with RAG system
        const ragStatus = classifyRAG(spread);

        return {
          tickerId: pair.ticker_id,
          market: `${pair.base}/${pair.target}`,
          baseSymbol: pair.base,
          targetSymbol: pair.target,
          highestBid: bid,
          lowestAsk: ask,
          spread,
          spreadPercentage: spread,
          ragStatus,
          lastPrice: summary?.last_price ?? 0,
          volume24h: summary?.base_volume ?? 0,
          high24h: summary?.high,
          low24h: summary?.low,
        };
      });

      // Sort by volume (highest first) for better UX
      processedMarkets.sort((a, b) => b.volume24h - a.volume24h);

      logger.info('[useMarketData] Processed markets', {
        total: processedMarkets.length,
        withLiquidity: processedMarkets.filter((m) => m.spread !== null).length,
      });

      setMarkets(processedMarkets);
      setLastUpdated(new Date());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch market data');
      logger.error('[useMarketData] Error fetching markets', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  /**
   * Public refresh function
   */
  const refresh = useCallback(async () => {
    await fetchMarkets();
  }, [fetchMarkets]);

  return {
    markets,
    loading,
    error,
    refresh,
    lastUpdated,
  };
}
