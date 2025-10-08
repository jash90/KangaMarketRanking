/**
 * useMarketFiltering Hook Tests
 *
 * Tests for market search filtering logic.
 */

import { useMarketFiltering } from '@/hooks';
import { renderHook } from '@testing-library/react-native';
import { MarketData } from '@/types';

const mockMarkets: MarketData[] = [
  {
    tickerId: 'BTC_USDT',
    market: 'BTC/USDT',
    baseSymbol: 'BTC',
    targetSymbol: 'USDT',
    highestBid: 16000,
    lowestAsk: 16100,
    spread: 0.62,
    spreadPercentage: 0.62,
    ragStatus: 'green',
    lastPrice: 16050,
    volume24h: 1000000,
  },
  {
    tickerId: 'ETH_USDT',
    market: 'ETH/USDT',
    baseSymbol: 'ETH',
    targetSymbol: 'USDT',
    highestBid: 1200,
    lowestAsk: 1210,
    spread: 0.83,
    spreadPercentage: 0.83,
    ragStatus: 'green',
    lastPrice: 1205,
    volume24h: 500000,
  },
  {
    tickerId: 'PEPE_USDT',
    market: 'PEPE/USDT',
    baseSymbol: 'PEPE',
    targetSymbol: 'USDT',
    highestBid: 0.00001,
    lowestAsk: 0.000015,
    spread: 40,
    spreadPercentage: 40,
    ragStatus: 'red',
    lastPrice: 0.0000125,
    volume24h: 100000,
  },
];

describe('useMarketFiltering', () => {
  it('should return all markets when query is empty', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, '');

    expect(filtered).toHaveLength(3);
    expect(filtered).toEqual(mockMarkets);
  });

  it('should filter by market name', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, 'BTC');

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.market).toBe('BTC/USDT');
  });

  it('should filter by ticker ID', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, 'ETH_USDT');

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.tickerId).toBe('ETH_USDT');
  });

  it('should filter by base symbol', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, 'PEPE');

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.baseSymbol).toBe('PEPE');
  });

  it('should filter by target symbol', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, 'USDT');

    expect(filtered).toHaveLength(3); // All have USDT target
  });

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered1 = result.current.filterMarkets(mockMarkets, 'btc');
    const filtered2 = result.current.filterMarkets(mockMarkets, 'BTC');
    const filtered3 = result.current.filterMarkets(mockMarkets, 'Btc');

    expect(filtered1).toHaveLength(1);
    expect(filtered2).toHaveLength(1);
    expect(filtered3).toHaveLength(1);
  });

  it('should trim whitespace from query', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, '  BTC  ');

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.market).toBe('BTC/USDT');
  });

  it('should return empty array when no matches', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, 'NONEXISTENT');

    expect(filtered).toHaveLength(0);
  });

  it('should filter by partial match', () => {
    const { result } = renderHook(() => useMarketFiltering());

    const filtered = result.current.filterMarkets(mockMarkets, 'PE'); // Matches PEPE

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.baseSymbol).toBe('PEPE');
  });

  it('should work with custom search fields', () => {
    const { result } = renderHook(() =>
      useMarketFiltering({ searchFields: ['market', 'tickerId'] })
    );

    // Should match on market/tickerId but not symbols
    const filtered = result.current.filterMarkets(mockMarkets, 'BTC');

    expect(filtered).toHaveLength(1);
  });
});
