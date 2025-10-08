/**
 * useMarketDepth Hook Tests
 *
 * Tests for market depth/order book data fetching and analysis.
 */

import { kangaApi } from '@/api/client';
import { ValidatedMarketDepth } from '@/api/validators';
import { useMarketDepth } from '@/hooks';
import { renderHook, waitFor } from '@testing-library/react-native';

// Mock the API client
jest.mock('@/api/client');

const mockDepth: ValidatedMarketDepth = {
  ticker_id: 'BTC_USDT',
  timestamp: Date.now(),
  bids: [
    { price: 16600, quantity: 0.5 },
    { price: 16590, quantity: 1.2 },
    { price: 16580, quantity: 0.8 },
  ],
  asks: [
    { price: 16610, quantity: 0.6 },
    { price: 16620, quantity: 1.0 },
    { price: 16630, quantity: 0.4 },
  ],
};

describe('useMarketDepth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (kangaApi.getMarketDepth as jest.Mock).mockResolvedValue(mockDepth);
  });

  it('should fetch and analyze market depth successfully', async () => {
    const { result } = renderHook(() => useMarketDepth('BTC_USDT'));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.depth).toBeNull();
    expect(result.current.analysis).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify depth data
    expect(result.current.depth).toEqual(mockDepth);
    expect(result.current.error).toBeNull();

    // Verify analysis calculations
    expect(result.current.analysis).toMatchObject({
      tickerId: 'BTC_USDT',
      totalBidQuantity: 2.5, // 0.5 + 1.2 + 0.8
      totalAskQuantity: 2.0, // 0.6 + 1.0 + 0.4
      bidDepth: 3,
      askDepth: 3,
    });

    // Verify price ranges
    expect(result.current.analysis?.bidPriceRange).toEqual({
      min: 16580,
      max: 16600,
    });
    expect(result.current.analysis?.askPriceRange).toEqual({
      min: 16610,
      max: 16630,
    });

    // Verify spread at depth
    expect(result.current.analysis?.spreadAtDepth).toBeCloseTo(0.06, 2);
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('Network error');
    (kangaApi.getMarketDepth as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useMarketDepth('BTC_USDT'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.depth).toBeNull();
    expect(result.current.analysis).toBeNull();
  });

  it('should handle empty market ID', async () => {
    const { result } = renderHook(() => useMarketDepth(''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Market ID is required');
    expect(kangaApi.getMarketDepth).not.toHaveBeenCalled();
  });

  it('should refresh data when refresh is called', async () => {
    const { result } = renderHook(() => useMarketDepth('BTC_USDT'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear mock history
    jest.clearAllMocks();

    // Trigger refresh
    await result.current.refresh();

    await waitFor(() => {
      expect(kangaApi.getMarketDepth).toHaveBeenCalledWith('BTC_USDT');
      expect(kangaApi.getMarketDepth).toHaveBeenCalledTimes(1);
    });
  });

  it('should refetch when marketId changes', async () => {
    const { result, rerender } = renderHook<ReturnType<typeof useMarketDepth>, { id: string }>(
      ({ id }) => useMarketDepth(id),
      { initialProps: { id: 'BTC_USDT' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(kangaApi.getMarketDepth).toHaveBeenCalledWith('BTC_USDT');

    // Change marketId
    jest.clearAllMocks();
    rerender({ id: 'ETH_USDT' });

    await waitFor(() => {
      expect(kangaApi.getMarketDepth).toHaveBeenCalledWith('ETH_USDT');
    });
  });
});
