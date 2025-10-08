/**
 * useMarketDepth Hook
 *
 * Fetches and analyzes order book depth for a specific market.
 */

import { kangaApi } from '@/api/client';
import { MarketDepthAnalysis } from '@/api/types';
import { ValidatedMarketDepth } from '@/api/validators';
import { logger } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

export interface UseMarketDepthReturn {
  depth: ValidatedMarketDepth | null;
  analysis: MarketDepthAnalysis | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Fetch and analyze market depth (order book)
 *
 * @param marketId - Ticker ID (e.g., "BTC_USDT")
 * @returns Order book data, analysis, and refresh function
 *
 * @example
 * const { depth, analysis, loading, error } = useMarketDepth('BTC_USDT');
 */
export function useMarketDepth(marketId: string): UseMarketDepthReturn {
  const [depth, setDepth] = useState<ValidatedMarketDepth | null>(null);
  const [analysis, setAnalysis] = useState<MarketDepthAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Analyze order book to extract useful metrics
   */
  const analyzeOrderBook = useCallback((depthData: ValidatedMarketDepth): MarketDepthAnalysis => {
    // Calculate total quantities
    const totalBidQuantity = depthData.bids.reduce((sum, bid) => sum + bid.quantity, 0);
    const totalAskQuantity = depthData.asks.reduce((sum, ask) => sum + ask.quantity, 0);

    // Calculate price ranges
    const bidPrices = depthData.bids.map((b) => b.price);
    const askPrices = depthData.asks.map((a) => a.price);

    const bidPriceRange =
      bidPrices.length > 0 ? { min: Math.min(...bidPrices), max: Math.max(...bidPrices) } : null;

    const askPriceRange =
      askPrices.length > 0 ? { min: Math.min(...askPrices), max: Math.max(...askPrices) } : null;

    // Calculate spread at depth
    const spreadAtDepth =
      bidPriceRange && askPriceRange
        ? ((askPriceRange.min - bidPriceRange.max) /
            (0.5 * (askPriceRange.min + bidPriceRange.max))) *
          100
        : null;

    return {
      tickerId: depthData.ticker_id,
      totalBidQuantity,
      totalAskQuantity,
      bidPriceRange,
      askPriceRange,
      bidDepth: depthData.bids.length,
      askDepth: depthData.asks.length,
      spreadAtDepth,
      timestamp: depthData.timestamp,
    };
  }, []);

  /**
   * Fetch market depth
   */
  const fetchDepth = useCallback(async () => {
    if (!marketId) {
      setError(new Error('Market ID is required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      logger.info('[useMarketDepth] Fetching depth', { marketId });

      const depthData = await kangaApi.getMarketDepth(marketId);
      const analysisData = analyzeOrderBook(depthData);

      setDepth(depthData);
      setAnalysis(analysisData);

      logger.info('[useMarketDepth] Depth fetched', {
        marketId,
        bids: depthData.bids.length,
        asks: depthData.asks.length,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch market depth');
      logger.error('[useMarketDepth] Error fetching depth', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [marketId, analyzeOrderBook]);

  /**
   * Fetch on mount and when marketId changes
   */
  useEffect(() => {
    fetchDepth();
  }, [fetchDepth]);

  /**
   * Public refresh function
   */
  const refresh = useCallback(async () => {
    await fetchDepth();
  }, [fetchDepth]);

  return {
    depth,
    analysis,
    loading,
    error,
    refresh,
  };
}
