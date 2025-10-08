/**
 * useFilteredAndSortedMarkets Hook Tests
 *
 * Tests for combined filtering and sorting orchestration.
 */

import { useFilteredAndSortedMarkets, UseFilteredAndSortedMarketsReturn } from '@/hooks';
import { MarketData } from '@/types';
import { act, renderHook } from '@testing-library/react-native';

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

describe('useFilteredAndSortedMarkets', () => {
  it('should return all markets when no search or sort applied', () => {
    const { result } = renderHook(() =>
      useFilteredAndSortedMarkets(mockMarkets, '', {
        sortingOptions: { defaultSort: { field: 'volume', order: 'desc' } },
      })
    );

    expect(result.current.filteredMarkets).toHaveLength(3);
  });

  it('should filter markets by search query', () => {
    const { result } = renderHook(() => useFilteredAndSortedMarkets(mockMarkets, 'BTC'));

    expect(result.current.filteredMarkets).toHaveLength(1);
    expect(result.current.filteredMarkets[0]?.market).toBe('BTC/USDT');
  });

  it('should sort filtered results', () => {
    const { result, rerender } = renderHook<
      UseFilteredAndSortedMarketsReturn,
      { markets: MarketData[]; query: string }
    >(({ markets, query }) => useFilteredAndSortedMarkets(markets, query), {
      initialProps: { markets: mockMarkets, query: '' },
    });

    act(() => {
      result.current.toggleSort('market');
    });

    rerender({ markets: mockMarkets, query: '' });

    // Should be sorted alphabetically
    expect(result.current.filteredMarkets[0]?.market).toBe('BTC/USDT');
    expect(result.current.filteredMarkets[1]?.market).toBe('ETH/USDT');
    expect(result.current.filteredMarkets[2]?.market).toBe('PEPE/USDT');
  });

  it('should apply both filtering and sorting together', () => {
    const marketsWithDuplicates = [
      ...mockMarkets,
      {
        tickerId: 'BTC_EUR',
        market: 'BTC/EUR',
        baseSymbol: 'BTC',
        targetSymbol: 'EUR',
        highestBid: 14000,
        lowestAsk: 14200,
        spread: 1.42,
        spreadPercentage: 1.42,
        ragStatus: 'amber' as const,
        lastPrice: 14100,
        volume24h: 800000,
      },
    ];

    const { result, rerender } = renderHook<
      UseFilteredAndSortedMarketsReturn,
      { markets: MarketData[]; query: string }
    >(({ markets, query }) => useFilteredAndSortedMarkets(markets, query), {
      initialProps: { markets: marketsWithDuplicates, query: 'BTC' },
    });

    // Filter to BTC markets only
    expect(result.current.filteredMarkets).toHaveLength(2);

    act(() => {
      result.current.toggleSort('spread'); // Sort by spread
    });

    rerender({ markets: marketsWithDuplicates, query: 'BTC' });

    // Should be sorted by spread within BTC markets
    expect(result.current.filteredMarkets[0]?.spread).toBe(0.62);
    expect(result.current.filteredMarkets[1]?.spread).toBe(1.42);
  });

  it('should return empty array when no matches', () => {
    const { result } = renderHook(() => useFilteredAndSortedMarkets(mockMarkets, 'NONEXISTENT'));

    expect(result.current.filteredMarkets).toHaveLength(0);
  });

  it('should provide sortConfigs from sorting hook', () => {
    const { result } = renderHook(() => useFilteredAndSortedMarkets(mockMarkets, ''));

    expect(result.current.sortConfigs).toBeDefined();
    expect(Array.isArray(result.current.sortConfigs)).toBe(true);
  });

  it('should provide toggleSort function', () => {
    const { result } = renderHook(() => useFilteredAndSortedMarkets(mockMarkets, ''));

    expect(typeof result.current.toggleSort).toBe('function');
  });

  it('should provide clearSorts function', () => {
    const { result } = renderHook(() => useFilteredAndSortedMarkets(mockMarkets, ''));

    expect(typeof result.current.clearSorts).toBe('function');
  });

  it('should update when markets array changes', () => {
    const { result, rerender } = renderHook<
      UseFilteredAndSortedMarketsReturn,
      { markets: MarketData[]; query: string }
    >(({ markets, query }) => useFilteredAndSortedMarkets(markets, query), {
      initialProps: { markets: mockMarkets.slice(0, 2), query: '' },
    });

    expect(result.current.filteredMarkets).toHaveLength(2);

    rerender({ markets: mockMarkets, query: '' });

    expect(result.current.filteredMarkets).toHaveLength(3);
  });

  it('should update when search query changes', () => {
    const { result, rerender } = renderHook<
      UseFilteredAndSortedMarketsReturn,
      { markets: MarketData[]; query: string }
    >(({ markets, query }) => useFilteredAndSortedMarkets(markets, query), {
      initialProps: { markets: mockMarkets, query: '' },
    });

    expect(result.current.filteredMarkets).toHaveLength(3);

    rerender({ markets: mockMarkets, query: 'BTC' });

    expect(result.current.filteredMarkets).toHaveLength(1);
  });

  it('should work with custom search fields', () => {
    const { result } = renderHook(() =>
      useFilteredAndSortedMarkets(mockMarkets, 'BTC', {
        searchFields: ['market'], // Only search market field
      })
    );

    expect(result.current.filteredMarkets).toHaveLength(1);
  });

  it('should combine compound sorting with filtering', () => {
    const { result, rerender } = renderHook<
      UseFilteredAndSortedMarketsReturn,
      { markets: MarketData[]; query: string }
    >(({ markets, query }) => useFilteredAndSortedMarkets(markets, query), {
      initialProps: { markets: mockMarkets, query: '' },
    });

    act(() => {
      result.current.toggleSort('market'); // Add market
      result.current.toggleSort('spread'); // Add spread
    });

    rerender({ markets: mockMarkets, query: '' });

    // Should have default volume + market + spread = 3 sorts
    expect(result.current.sortConfigs.length).toBeGreaterThanOrEqual(2);
    expect(result.current.sortConfigs).toContainEqual(expect.objectContaining({ field: 'market' }));
    expect(result.current.sortConfigs).toContainEqual(expect.objectContaining({ field: 'spread' }));
  });
});
