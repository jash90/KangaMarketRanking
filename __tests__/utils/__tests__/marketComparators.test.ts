/**
 * Market Comparators Tests
 *
 * Unit tests for pure market comparison functions.
 */

import {
  compareByField,
  compareByMarket,
  compareByPrice,
  compareByRAGStatus,
  compareBySpread,
  compareByVolume,
} from '@/utils/marketComparators';
import { MarketData } from '@/types';

const createMockMarket = (overrides: Partial<MarketData>): MarketData => ({
  tickerId: 'TEST_USDT',
  market: 'TEST/USDT',
  baseSymbol: 'TEST',
  targetSymbol: 'USDT',
  highestBid: 100,
  lowestAsk: 102,
  spread: 1.0,
  spreadPercentage: 1.0,
  ragStatus: 'green',
  lastPrice: 101,
  volume24h: 1000,
  ...overrides,
});

describe('Market Comparators', () => {
  describe('compareByMarket', () => {
    it('should sort markets alphabetically', () => {
      const a = createMockMarket({ market: 'BTC/USDT' });
      const b = createMockMarket({ market: 'ETH/USDT' });

      expect(compareByMarket(a, b)).toBeLessThan(0); // BTC < ETH
      expect(compareByMarket(b, a)).toBeGreaterThan(0); // ETH > BTC
    });

    it('should return 0 for equal market names', () => {
      const a = createMockMarket({ market: 'BTC/USDT' });
      const b = createMockMarket({ market: 'BTC/USDT' });

      expect(compareByMarket(a, b)).toBe(0);
    });
  });

  describe('compareBySpread', () => {
    it('should sort by spread percentage', () => {
      const a = createMockMarket({ spread: 0.5 });
      const b = createMockMarket({ spread: 1.5 });

      expect(compareBySpread(a, b)).toBeLessThan(0);
      expect(compareBySpread(b, a)).toBeGreaterThan(0);
    });

    it('should handle null spreads (sort to end)', () => {
      const a = createMockMarket({ spread: 0.5 });
      const b = createMockMarket({ spread: null });

      expect(compareBySpread(a, b)).toBeLessThan(0); // non-null before null
      expect(compareBySpread(b, a)).toBeGreaterThan(0); // null after non-null
    });

    it('should return 0 when both spreads are null', () => {
      const a = createMockMarket({ spread: null });
      const b = createMockMarket({ spread: null });

      expect(compareBySpread(a, b)).toBe(0);
    });
  });

  describe('compareByVolume', () => {
    it('should sort by 24h volume', () => {
      const a = createMockMarket({ volume24h: 500 });
      const b = createMockMarket({ volume24h: 1000 });

      expect(compareByVolume(a, b)).toBeLessThan(0);
      expect(compareByVolume(b, a)).toBeGreaterThan(0);
    });

    it('should return 0 for equal volumes', () => {
      const a = createMockMarket({ volume24h: 1000 });
      const b = createMockMarket({ volume24h: 1000 });

      expect(compareByVolume(a, b)).toBe(0);
    });
  });

  describe('compareByPrice', () => {
    it('should sort by last price', () => {
      const a = createMockMarket({ lastPrice: 100 });
      const b = createMockMarket({ lastPrice: 200 });

      expect(compareByPrice(a, b)).toBeLessThan(0);
      expect(compareByPrice(b, a)).toBeGreaterThan(0);
    });

    it('should return 0 for equal prices', () => {
      const a = createMockMarket({ lastPrice: 100 });
      const b = createMockMarket({ lastPrice: 100 });

      expect(compareByPrice(a, b)).toBe(0);
    });
  });

  describe('compareByRAGStatus', () => {
    it('should sort green before amber', () => {
      const a = createMockMarket({ ragStatus: 'green' });
      const b = createMockMarket({ ragStatus: 'amber' });

      expect(compareByRAGStatus(a, b)).toBeLessThan(0);
    });

    it('should sort amber before red', () => {
      const a = createMockMarket({ ragStatus: 'amber' });
      const b = createMockMarket({ ragStatus: 'red' });

      expect(compareByRAGStatus(a, b)).toBeLessThan(0);
    });

    it('should sort green before red', () => {
      const a = createMockMarket({ ragStatus: 'green' });
      const b = createMockMarket({ ragStatus: 'red' });

      expect(compareByRAGStatus(a, b)).toBeLessThan(0);
    });

    it('should return 0 for equal statuses', () => {
      const a = createMockMarket({ ragStatus: 'green' });
      const b = createMockMarket({ ragStatus: 'green' });

      expect(compareByRAGStatus(a, b)).toBe(0);
    });
  });

  describe('compareByField', () => {
    it('should dispatch to compareByMarket', () => {
      const a = createMockMarket({ market: 'BTC/USDT' });
      const b = createMockMarket({ market: 'ETH/USDT' });

      expect(compareByField(a, b, 'market')).toBeLessThan(0);
    });

    it('should dispatch to compareBySpread', () => {
      const a = createMockMarket({ spread: 0.5 });
      const b = createMockMarket({ spread: 1.5 });

      expect(compareByField(a, b, 'spread')).toBeLessThan(0);
    });

    it('should dispatch to compareByVolume', () => {
      const a = createMockMarket({ volume24h: 500 });
      const b = createMockMarket({ volume24h: 1000 });

      expect(compareByField(a, b, 'volume')).toBeLessThan(0);
    });

    it('should dispatch to compareByPrice', () => {
      const a = createMockMarket({ lastPrice: 100 });
      const b = createMockMarket({ lastPrice: 200 });

      expect(compareByField(a, b, 'price')).toBeLessThan(0);
    });

    it('should dispatch to compareByRAGStatus', () => {
      const a = createMockMarket({ ragStatus: 'green' });
      const b = createMockMarket({ ragStatus: 'red' });

      expect(compareByField(a, b, 'ragStatus')).toBeLessThan(0);
    });

    it('should return 0 for unknown field', () => {
      const a = createMockMarket({});
      const b = createMockMarket({});

      expect(compareByField(a, b, 'unknown' as any)).toBe(0);
    });
  });
});
