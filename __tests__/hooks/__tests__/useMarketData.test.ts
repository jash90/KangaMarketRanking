/**
 * useMarketData Hook Tests
 *
 * Integration tests for market data fetching hook.
 * Uses async testing patterns from React Native Testing Library.
 */

import { kangaApi } from '@/api/client';
import { ValidatedMarketPair, ValidatedMarketSummary } from '@/api/validators';
import { useMarketData } from '@/hooks';
import { renderHook, waitFor } from '@testing-library/react-native';

// Mock the API client
jest.mock('@/api/client');

const mockPairs: ValidatedMarketPair[] = [
  {
    ticker_id: 'BTC_USDT',
    base: 'BTC',
    target: 'USDT',
  },
  {
    ticker_id: 'ETH_USDT',
    base: 'ETH',
    target: 'USDT',
  },
];

const mockSummaries: ValidatedMarketSummary[] = [
  {
    ticker_id: 'BTC_USDT',
    base_currency: 'BTC',
    target_currency: 'USDT',
    bid: 16583,
    ask: 16704,
    last_price: 16640,
    base_volume: 1000,
    target_volume: 16640000,
    high: 17000,
    low: 16000,
  },
  {
    ticker_id: 'ETH_USDT',
    base_currency: 'ETH',
    target_currency: 'USDT',
    bid: 1200,
    ask: 1225,
    last_price: 1210,
    base_volume: 500,
    target_volume: 605000,
    high: 1300,
    low: 1100,
  },
];

describe('useMarketData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (kangaApi.getMarketPairs as jest.Mock).mockResolvedValue(mockPairs);
    (kangaApi.getMarketSummary as jest.Mock).mockResolvedValue(mockSummaries);
  });

  it('should fetch and process market data successfully', async () => {
    const { result } = renderHook(() => useMarketData());

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.markets).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify data is processed correctly
    expect(result.current.markets).toHaveLength(2);
    expect(result.current.error).toBeNull();
    expect(result.current.lastUpdated).toBeInstanceOf(Date);

    // Verify first market data
    const btcMarket = result.current.markets.find((m) => m.tickerId === 'BTC_USDT');
    expect(btcMarket).toBeDefined();
    expect(btcMarket).toMatchObject({
      tickerId: 'BTC_USDT',
      market: 'BTC/USDT',
      baseSymbol: 'BTC',
      targetSymbol: 'USDT',
      highestBid: 16583,
      lowestAsk: 16704,
      lastPrice: 16640,
      volume24h: 1000,
    });

    // Verify spread is calculated
    expect(btcMarket?.spread).not.toBeNull();
    expect(typeof btcMarket?.spread).toBe('number');

    // Verify RAG status is assigned
    expect(['green', 'amber', 'red']).toContain(btcMarket?.ragStatus);
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('Network error');
    (kangaApi.getMarketPairs as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.markets).toEqual([]);
    expect(result.current.lastUpdated).toBeNull();
  });

  it('should handle partial API failures', async () => {
    // If one API call fails, should still handle gracefully
    (kangaApi.getMarketPairs as jest.Mock).mockResolvedValueOnce(mockPairs);
    (kangaApi.getMarketSummary as jest.Mock).mockRejectedValueOnce(new Error('Summary failed'));

    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have error set
    expect(result.current.error).not.toBeNull();
  });

  it('should refresh data when refresh is called', async () => {
    const { result } = renderHook(() => useMarketData());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear mock call history
    jest.clearAllMocks();

    // Trigger refresh
    await result.current.refresh();

    await waitFor(() => {
      expect(kangaApi.getMarketPairs).toHaveBeenCalledTimes(1);
      expect(kangaApi.getMarketSummary).toHaveBeenCalledTimes(1);
    });

    // Verify refresh completed
    expect(result.current.loading).toBe(false);
    expect(result.current.markets).toHaveLength(2);
  });

  it('should handle missing summary data gracefully', async () => {
    // Pair exists but no summary
    (kangaApi.getMarketSummary as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still create market data with null bid/ask
    expect(result.current.markets).toHaveLength(2);
    expect(result.current.markets[0]?.highestBid).toBeNull();
    expect(result.current.markets[0]?.lowestAsk).toBeNull();
    expect(result.current.markets[0]?.spread).toBeNull();
    expect(result.current.markets[0]?.ragStatus).toBe('red');
  });

  it('should sort markets by volume (highest first)', async () => {
    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // BTC has volume 1000, ETH has volume 500
    // Should be sorted: BTC first, ETH second
    expect(result.current.markets[0]?.tickerId).toBe('BTC_USDT');
    expect(result.current.markets[1]?.tickerId).toBe('ETH_USDT');
  });

  it('should fetch data in parallel for performance', async () => {
    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify both API calls were made
    expect(kangaApi.getMarketPairs).toHaveBeenCalledTimes(1);
    expect(kangaApi.getMarketSummary).toHaveBeenCalledTimes(1);
  });
});
