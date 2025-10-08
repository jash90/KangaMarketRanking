/**
 * Market Comparators
 *
 * Pure comparison functions for sorting market data.
 * These functions are used by sorting hooks and can be tested independently.
 */

import { SortField } from '@/api/types';
import { MarketData } from '@/types';

/**
 * Compare two markets by market name (alphabetical)
 */
export function compareByMarket(a: MarketData, b: MarketData): number {
  return a.market.localeCompare(b.market);
}

/**
 * Compare two markets by spread percentage
 * Null spreads are sorted to the end
 */
export function compareBySpread(a: MarketData, b: MarketData): number {
  if (a.spread === null && b.spread === null) return 0;
  if (a.spread === null) return 1;
  if (b.spread === null) return -1;
  return a.spread - b.spread;
}

/**
 * Compare two markets by 24h volume
 */
export function compareByVolume(a: MarketData, b: MarketData): number {
  return a.volume24h - b.volume24h;
}

/**
 * Compare two markets by last price
 */
export function compareByPrice(a: MarketData, b: MarketData): number {
  return a.lastPrice - b.lastPrice;
}

/**
 * Compare two markets by RAG status
 * Order: green < amber < red
 */
export function compareByRAGStatus(a: MarketData, b: MarketData): number {
  const ragOrder = { green: 0, amber: 1, red: 2 } as const;
  return ragOrder[a.ragStatus] - ragOrder[b.ragStatus];
}

/**
 * Generic comparator that dispatches to specific field comparators
 *
 * @param a - First market to compare
 * @param b - Second market to compare
 * @param field - Field to compare by
 * @returns Comparison result (-1, 0, or 1)
 *
 * @example
 * markets.sort((a, b) => compareByField(a, b, 'spread'));
 */
export function compareByField(a: MarketData, b: MarketData, field: SortField): number {
  switch (field) {
    case 'market':
      return compareByMarket(a, b);
    case 'spread':
      return compareBySpread(a, b);
    case 'volume':
      return compareByVolume(a, b);
    case 'price':
      return compareByPrice(a, b);
    case 'ragStatus':
      return compareByRAGStatus(a, b);
    default:
      return 0;
  }
}
